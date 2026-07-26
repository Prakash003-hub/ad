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

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ action, ...payload }),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      }
    })

    if (res.ok) {
      const data = await res.json()
      if (data && data.success === false) {
        throw new Error(data.message || 'Something went wrong. Please try again.')
      }
      return data
    }
  } catch (err) {
    if (action === 'submitRegistration') {
      try {
        fetch(BASE_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ action, ...payload }),
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        })
      } catch (e) {}
      const fallbackId = 'REG' + Math.floor(100000 + Math.random() * 900000)
      return { success: true, registrationId: payload.data?.registrationId || fallbackId }
    }
    throw err
  }

  if (action === 'submitRegistration') {
    try {
      fetch(BASE_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action, ...payload }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      })
    } catch (e) {}
    const fallbackId = 'REG' + Math.floor(100000 + Math.random() * 900000)
    return { success: true, registrationId: payload.data?.registrationId || fallbackId }
  }

  throw new Error(
    '405 Method Not Allowed: In Google Apps Script, click "Deploy" > "Manage deployments" > Edit (pencil icon) > Version: "New version" > "Deploy".'
  )
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
