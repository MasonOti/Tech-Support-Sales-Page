# TechSupport product page

A product discovery and enquiry page for TechSupport, a laptop and technology seller in Nigeria. Visitors can browse laptops, compare specifications and send an enquiry. There is no cart and no checkout. Every enquiry goes to a Make.com scenario as a lead.

This is a separate project from the Techsupport Africa enquiry page.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole page: layout, styles, product data, webhook setting and form code |
| `README.md` | This guide |

## How an enquiry travels

1. A visitor clicks **Enquire About This Laptop**. The page scrolls to the form and fills in the product.
2. They fill in their details and click **Send Enquiry**. The page checks the required fields.
3. The page sends one JSON object straight to the Make webhook.
4. The success message appears only when Make replies that it accepted the data.

Make receives these exact field names:

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

`Lead Source` is always `Product Page`. `Submission Date` is the visitor's send time in ISO 8601 format (UTC), which Make reads as a date. Nigeria is UTC+1.

## Editing the page

Open `index.html` and search for `EDITABLE CONTENT`. It is near the bottom of the file. Everything you would want to change is in that one block:

- `makeWebhookUrl`: the Make webhook that receives enquiries.
- `contact`: the email, phone and country shown on the page. These are placeholders now.
- `priceNote`: the line under each price saying it is a sample.
- `budgetOptions`: the choices in the Budget dropdown.
- `products`: one `{ ... }` block per laptop, with `name`, `category`, `description`, `processor`, `ram`, `storage`, `screen` and `price`.

Write `price` as a plain number, like `650000`. The page shows it as ₦650,000.

The product cards, the comparison table and the form's product dropdown all update from this block. To add a laptop, copy a block and change it. To remove one, delete its block.

### Product photos

Each product has `image: ""`, which shows a sample laptop drawing. When you have real photos, upload them somewhere public and put the link in `image`, for example `image: "https://your-site.com/photos/hp-elitebook.jpg"`.

## Changing the webhook

Replace the address in `makeWebhookUrl` with the one from your Make Custom Webhook module. If you set it to `""`, the form shows a configuration error and does not pretend the enquiry was sent.

The webhook address is visible to anyone who views the page source. That is normal for a simple form like this. If you ever start getting junk leads, add a filter in Make (for example, drop bundles with no email) or create a new webhook and update the address here.

## Testing the form

1. In Make, open the scenario with the Custom Webhook and click **Run once** so it is listening.
2. Double-click `index.html` to open it in your browser, or open the deployed Vercel page.
3. Click **Enquire About This Laptop** on any card, fill in the form and send it.
4. The bundle appears in Make. The first time, Make may ask you to **Redetermine data structure**. Do that, send one more test, then map the eight fields in your next modules.

Things worth checking:

- Leave Name, Email or Phone empty and click Send. You should see a message under each field.
- Click Send several times quickly. Only one enquiry should reach Make.
- Try the page on a phone. The menu collapses into a button at the top right.

## Before going live

- Replace the sample specs and prices with real ones.
- Replace the placeholder email and phone number.
- Add real product photos.
