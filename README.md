# TechSupport product page

A product discovery and enquiry page for TechSupport, a laptop and technology seller in Nigeria. Visitors can browse laptops, compare specifications and send an enquiry. There is no cart and no checkout. Every enquiry goes to a Make.com scenario as a lead.

This is a separate project from the Techsupport Africa enquiry page.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole page: layout, styles, product data and form code |
| `api/product-enquiry.js` | Server code that forwards each enquiry to Make |
| `README.md` | This guide |

The `api` file has to be separate. It runs on Vercel's server, not in the visitor's browser, which is what keeps the Make webhook URL secret. If the URL were inside `index.html`, anyone could read it and send fake leads.

## How an enquiry travels

1. A visitor clicks **Enquire About This Laptop**. The page scrolls to the form and fills in the product.
2. They fill in their details and click **Send Enquiry**. The page checks the required fields.
3. The page sends the data to `/api/product-enquiry` on the same site.
4. That server code checks the data again, adds `Lead Source` and `Submission Date`, and sends it to Make as JSON.
5. The page shows a success message only when Make has accepted it.

Make receives one JSON object with these exact field names:

```json
{
  "Customer Name": "Ada Test",
  "Email": "ada@example.com",
  "Phone": "0803 000 0000",
  "Product Interested In": "Dell Latitude",
  "Budget": "₦400,000 to ₦600,000",
  "Customer Message": "Need 3 for the office",
  "Lead Source": "Product Page",
  "Submission Date": "2026-11-16T10:14:23.413Z"
}
```

`Lead Source` is always `Product Page`. `Submission Date` is the server time in ISO 8601 format (UTC), which Make reads as a date. Nigeria is UTC+1.

## Editing products, prices and contact details

Open `index.html` and search for `EDITABLE CONTENT`. It is near the bottom of the file. Everything you would want to change is in that one block:

- `contact`: the email, phone and country shown on the page. These are placeholders now.
- `priceNote`: the line under each price saying it is a sample.
- `budgetOptions`: the choices in the Budget dropdown.
- `products`: one `{ ... }` block per laptop, with `name`, `category`, `description`, `processor`, `ram`, `storage`, `screen` and `price`.

Write `price` as a plain number, like `650000`. The page shows it as ₦650,000.

The product cards, the comparison table and the form's product dropdown all update from this block. To add a laptop, copy a block and change it. To remove one, delete its block.

### Product photos

Each product has `image: ""`, which shows a sample laptop drawing. When you have real photos, upload them somewhere public and put the link in `image`, for example `image: "https://your-site.com/photos/hp-elitebook.jpg"`.

## Setting the Make webhook URL

The server code reads the webhook from an environment variable called `MAKE_WEBHOOK_URL`. It is never written in the code.

On Vercel:

1. Open the project, then **Settings**, then **Environment Variables**.
2. Add `MAKE_WEBHOOK_URL` with your webhook address from Make (it starts with `https://hook.eu1.make.com/`).
3. Redeploy so the new setting is picked up.

If the variable is missing, the form shows a configuration error and does not pretend the enquiry was sent.

## Testing the form

Double-clicking `index.html` lets you check the design, but the form will not send because there is no server behind it. To test the full flow:

1. Deploy to Vercel (a preview deployment is fine) with `MAKE_WEBHOOK_URL` set.
2. In Make, open the scenario with the Custom Webhook and click **Run once** so it is listening.
3. Open the deployed page, click **Enquire About This Laptop** on any card, fill in the form and send it.
4. The bundle appears in Make. The first time, Make may ask you to **Redetermine data structure**. Do that, send one more test, then map the eight fields in your next modules.

Things worth checking:

- Leave Name, Email or Phone empty and click Send. You should see a message under each field.
- Click Send several times quickly. Only one enquiry should reach Make.
- Try the page on a phone. The menu collapses into a button at the top right.

## Before going live

- Replace the sample specs and prices with real ones.
- Replace the placeholder email and phone number.
- Add real product photos.
- Set `MAKE_WEBHOOK_URL` on Vercel.
