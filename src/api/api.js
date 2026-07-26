// ==========================================================================
// API client for the Google Apps Script backend.
// Set VITE_API_URL in a .env file to your deployed Web App /exec URL.
// Example: VITE_API_URL="https://script.google.com/macros/s/XXXX/exec"
// ==========================================================================

const BASE_URL = import.meta.env.VITE_API_URL || ''

async function callApi(action, payload = {}, method = 'POST') {
  if (!BASE_URL) {
    throw new Error(
      'API URL is not configured. Set VITE_API_URL in your .env file to the deployed Apps Script Web App URL.'
    )
  }

  // Apps Script Web Apps only reliably support GET/POST with no custom
  // headers (to avoid CORS preflight), so everything is sent as POST
  // with a JSON string body and the action embedded in the payload.
  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action, ...payload }),
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    }
  })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }

  const data = await res.json()
  if (data && data.success === false) {
    throw new Error(data.message || 'Something went wrong. Please try again.')
  }
  return data
}

export const api = {
  // Public
  submitRegistration: (formData) => callApi('submitRegistration', { data: formData }),

  // Admin
  adminLogin: (username, password) => callApi('adminLogin', { username, password }),
  getDashboardStats: (token) => callApi('getDashboardStats', { token }),
  listRegistrations: (token, filters = {}) => callApi('listRegistrations', { token, filters }),
  updateRegistration: (token, id, updates) => callApi('updateRegistration', { token, id, updates }),
  deleteRegistration: (token, id) => callApi('deleteRegistration', { token, id }),
  runLuckyDraw: (token, winnerCount = 100) => callApi('runLuckyDraw', { token, winnerCount }),
  listWinners: (token) => callApi('listWinners', { token }),
  markDelivered: (token, id) => callApi('markDelivered', { token, id }),
  exportUrl: (token, scope = 'all') =>
    `${BASE_URL}?action=exportExcel&token=${encodeURIComponent(token)}&scope=${scope}`
}
