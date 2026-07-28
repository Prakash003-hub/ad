/**
 * Generates dynamic date and WhatsApp share message for Micro Notes Offer.
 */

/**
 * Calculates (Current Date + offsetDays) and returns formatted date string (DD/MM/YYYY).
 * @param {number} offsetDays Number of days to add from today (default: 5)
 * @returns {string} Formatted date string (e.g. "02/08/2026")
 */
export function getFormattedLastDate(offsetDays = 5) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Generates the full WhatsApp promo message with dynamic LAST_DATE (Current Date + 5 Days).
 * @param {number} offsetDays 
 * @returns {string} WhatsApp promotional message
 */
export function getWhatsAppShareMessage(offsetDays = 5) {
  const lastDate = getFormattedLastDate(offsetDays)

  return `🎉 *மைக்ரோ நோட்ஸ் திறப்பு விழா சிறப்பு சலுகை!*

📚 *School, College, TNPSC, NEET/JEE உள்ளிட்ட அனைத்து Study Guides-ஐ இலவசமாகப் பெறும் வாய்ப்பு!*

🎁 பதிவு செய்பவர்களில் இருந்து *குலுக்கல் முறையில் 100 அதிர்ஷ்டசாலிகள்* தேர்வு செய்யப்பட்டு இலவச Study Guide புத்தகங்கள் வழங்கப்படும்.

⏳ *பதிவு செய்ய கடைசி தேதி:* ${lastDate}

📞 தேர்வு செய்யப்பட்டவர்களை எங்கள் குழு மொபைல் மூலம் தொடர்புகொள்ளும்.

🚀 *இந்த அரிய வாய்ப்பை தவறவிடாதீர்கள்!*

👉 *இப்போதே பதிவு செய்யுங்கள்:*
https://micronotesoffer.vercel.app

📲 *இந்த செய்தியை உங்கள் நண்பர்கள் மற்றும் மாணவர் குழுக்களுக்கும் பகிருங்கள்!*`
}

/**
 * Returns the WhatsApp web/app share URL for the promo message.
 * @param {number} offsetDays 
 * @returns {string} WhatsApp API URL
 */
export function getWhatsAppShareUrl(offsetDays = 5) {
  const text = getWhatsAppShareMessage(offsetDays)
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
}
