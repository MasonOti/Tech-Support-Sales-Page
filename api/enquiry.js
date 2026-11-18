// Vercel serverless function. The browser posts the enquiry here, and this code
// forwards it to Make. The Make address lives only in a Vercel environment
// variable, so visitors can never read it from the page.

const FIELDS = [
  "Customer Name",
  "Email",
  "Phone",
  "Product Interested In",
  "Budget",
  "Customer Message",
];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  const webhookUrl = process.env.MAKE_PRODUCT_ENQUIRY_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ success: false, message: "The enquiry service is not configured." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ success: false, message: "Invalid request." });
  }

  // Keep only the expected fields, as short text, so nobody can push extra data through.
  const payload = {};
  for (const name of FIELDS) {
    payload[name] = String(body[name] ?? "").slice(0, 2000).trim();
  }

  if (!payload["Customer Name"] || !payload["Email"] || !payload["Phone"] || !payload["Product Interested In"]) {
    return res.status(400).json({ success: false, message: "Please fill in the required fields." });
  }

  // The server sets these two, so the browser cannot fake them.
  payload["Lead Source"] = "Product Page";
  payload["Submission Date"] = new Date().toISOString();

  try {
    const makeRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!makeRes.ok) {
      return res.status(502).json({ success: false, message: "The enquiry service did not accept your enquiry." });
    }
    return res.status(200).json({ success: true, message: "Your enquiry has been received successfully." });
  } catch (err) {
    return res.status(502).json({ success: false, message: "Could not reach the enquiry service." });
  }
};

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
