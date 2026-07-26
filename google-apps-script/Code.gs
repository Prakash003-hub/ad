/**
 * FREE STUDY GUIDE REGISTRATION — Backend (Google Apps Script)
 * ------------------------------------------------------------
 * Deploy this as a Web App (Deploy > New deployment > Web app):
 *   - Execute as: Me
 *   - Who has access: Anyone
 * Copy the /exec URL into the frontend's VITE_API_URL.
 *
 * Data lives in the bound Google Sheet, in a tab named "Registrations".
 * Admin credentials & session tokens live in Script Properties.
 */

const SHEET_NAME = 'Registrations';
const ADMIN_SESSION_HOURS = 8;

const COLUMNS = [
  'registrationId', 'timestamp', 'fullName', 'mobile', 'age', 'gender',
  'category', 'schoolName', 'standard', 'subject',
  'collegeName', 'degree', 'department', 'courseCode', 'year',
  'occupation', 'occupationOther', 'guideType', 'language',
  'door', 'area', 'district', 'pincode',
  'referral', 'source', 'status'
];

// --------------------------------------------------------------------------
// Entry points
// --------------------------------------------------------------------------

function doGet(e) {
  if (!e || !e.parameter) {
    return jsonResponse({ success: true, message: 'Study Guide Registration API is running.' });
  }

  const params = e.parameter;
  const action = params.action;
  if (action === 'exportExcel') {
    return handleExport(params.token, params.scope || 'all');
  }
  return jsonResponse({ success: true, message: 'Study Guide Registration API is running.' });
}

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return jsonResponse({ success: false, message: 'Missing request body.' });
  }

  let body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ success: false, message: 'Invalid request body.' });
  }

  const action = body.action;

  try {
    switch (action) {
      case 'submitRegistration':
        return jsonResponse(submitRegistration(body.data));
      case 'adminLogin':
        return jsonResponse(adminLogin(body.username, body.password));
      case 'getDashboardStats':
        requireAdmin(body.token);
        return jsonResponse(getDashboardStats());
      case 'listRegistrations':
        requireAdmin(body.token);
        return jsonResponse(listRegistrations(body.filters || {}));
      case 'updateRegistration':
        requireAdmin(body.token);
        return jsonResponse(updateRegistration(body.id, body.updates || {}));
      case 'deleteRegistration':
        requireAdmin(body.token);
        return jsonResponse(deleteRegistration(body.id));
      case 'runLuckyDraw':
        requireAdmin(body.token);
        return jsonResponse(runLuckyDraw(body.winnerCount || 100));
      case 'listWinners':
        requireAdmin(body.token);
        return jsonResponse(listWinners());
      case 'markDelivered':
        requireAdmin(body.token);
        return jsonResponse(markDelivered(body.id));
      default:
        return jsonResponse({ success: false, message: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ success: false, message: err.message });
  }
}

// --------------------------------------------------------------------------
// Public: registration
// --------------------------------------------------------------------------

function submitRegistration(data) {
  if (!data || !data.fullName || !data.mobile) {
    throw new Error('Full name and mobile number are required.');
  }

  const sheet = getSheet();

  // If registrationId is provided, update existing row
  if (data.registrationId) {
    const rowIndex = findRowIndexById(data.registrationId);
    if (rowIndex !== -1) {
      Object.keys(data).forEach((key) => {
        const colIndex = COLUMNS.indexOf(key);
        if (colIndex !== -1 && key !== 'registrationId') {
          sheet.getRange(rowIndex, colIndex + 1).setValue(data[key]);
        }
      });
      return { success: true, registrationId: data.registrationId };
    }
  }

  // Create new registration row
  const registrationId = 'REG' + Utilities.formatDate(new Date(), 'Etc/GMT-5:30', 'yyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000);
  const timestamp = new Date().toISOString();

  const row = COLUMNS.map((col) => {
    if (col === 'registrationId') return registrationId;
    if (col === 'timestamp') return timestamp;
    if (col === 'status') return 'Pending';
    return data[col] !== undefined ? data[col] : '';
  });

  sheet.appendRow(row);

  return { success: true, registrationId: registrationId };
}

// --------------------------------------------------------------------------
// Admin: auth
// --------------------------------------------------------------------------

function adminLogin(username, password) {
  const props = PropertiesService.getScriptProperties();
  const validUser = props.getProperty('ADMIN_USERNAME') || 'admin';
  const validPass = props.getProperty('ADMIN_PASSWORD') || 'changeme123';

  if (username !== validUser || password !== validPass) {
    throw new Error('Invalid username or password.');
  }

  const token = Utilities.getUuid();
  const expiry = Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000;
  props.setProperty('SESSION_' + token, String(expiry));

  return { success: true, token: token };
}

function requireAdmin(token) {
  if (!token) throw new Error('Missing admin token.');
  const props = PropertiesService.getScriptProperties();
  const expiry = props.getProperty('SESSION_' + token);
  if (!expiry || Number(expiry) < Date.now()) {
    throw new Error('Session expired. Please log in again.');
  }
}

// --------------------------------------------------------------------------
// Admin: data
// --------------------------------------------------------------------------

function getAllRows() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = row[i]));
    return obj;
  }).filter((r) => r.registrationId);
}

function getDashboardStats() {
  const rows = getAllRows();
  const stats = {
    total: rows.length,
    school: rows.filter((r) => r.category === 'School').length,
    college: rows.filter((r) => r.category === 'College').length,
    others: rows.filter((r) => r.category === 'Others').length,
    pending: rows.filter((r) => r.status === 'Pending').length,
    winners: rows.filter((r) => r.status === 'Winner').length,
    delivered: rows.filter((r) => r.status === 'Delivered').length
  };
  return { success: true, stats: stats };
}

function listRegistrations(filters) {
  let rows = getAllRows();
  if (filters.search) {
    const q = String(filters.search).toLowerCase();
    rows = rows.filter((r) =>
      String(r.fullName).toLowerCase().includes(q) ||
      String(r.mobile).includes(q) ||
      String(r.district).toLowerCase().includes(q)
    );
  }
  if (filters.status) {
    rows = rows.filter((r) => r.status === filters.status);
  }
  rows.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return { success: true, registrations: rows };
}

function findRowIndexById(id) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) return i + 1; // 1-indexed sheet row
  }
  return -1;
}

function updateRegistration(id, updates) {
  const sheet = getSheet();
  const rowIndex = findRowIndexById(id);
  if (rowIndex === -1) throw new Error('Registration not found.');

  Object.keys(updates).forEach((key) => {
    const colIndex = COLUMNS.indexOf(key);
    if (colIndex !== -1) {
      sheet.getRange(rowIndex, colIndex + 1).setValue(updates[key]);
    }
  });

  return { success: true };
}

function deleteRegistration(id) {
  const sheet = getSheet();
  const rowIndex = findRowIndexById(id);
  if (rowIndex === -1) throw new Error('Registration not found.');
  sheet.deleteRow(rowIndex);
  return { success: true };
}

// --------------------------------------------------------------------------
// Lucky draw
// --------------------------------------------------------------------------

function runLuckyDraw(winnerCount) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const statusCol = headers.indexOf('status');

  const pendingRowIndices = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i][statusCol] === 'Pending') pendingRowIndices.push(i);
  }

  // Fisher-Yates shuffle
  for (let i = pendingRowIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pendingRowIndices[i], pendingRowIndices[j]] = [pendingRowIndices[j], pendingRowIndices[i]];
  }

  const winners = pendingRowIndices.slice(0, winnerCount);
  winners.forEach((rowIdx) => {
    sheet.getRange(rowIdx + 1, statusCol + 1).setValue('Winner');
  });

  return { success: true, winnerCount: winners.length };
}

function listWinners() {
  const rows = getAllRows().filter((r) => r.status === 'Winner' || r.status === 'Delivered');
  return { success: true, winners: rows };
}

function markDelivered(id) {
  return updateRegistration(id, { status: 'Delivered' });
}

// --------------------------------------------------------------------------
// Export
// --------------------------------------------------------------------------

function handleExport(token, scope) {
  requireAdmin(token);
  let rows = getAllRows();
  if (scope === 'winners') {
    rows = rows.filter((r) => r.status === 'Winner' || r.status === 'Delivered');
  }

  const csvRows = [COLUMNS.join(',')];
  rows.forEach((r) => {
    csvRows.push(COLUMNS.map((c) => csvEscape(r[c])).join(','));
  });

  const csv = csvRows.join('\n');
  return ContentService.createTextOutput(csv).setMimeType(ContentService.MimeType.CSV);
}

function csvEscape(value) {
  const str = String(value === undefined || value === null ? '' : value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// --------------------------------------------------------------------------
// Sheet helpers
// --------------------------------------------------------------------------

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run once manually from the Apps Script editor to set your admin
 * credentials (Project Settings > Script Properties also works).
 */
function setupAdminCredentials() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('ADMIN_USERNAME', 'admin');
  props.setProperty('ADMIN_PASSWORD', 'changeme123'); // ⚠️ change this before deploying
}
