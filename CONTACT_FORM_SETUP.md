# Contact Form Setup Instructions

## Overview
The contact form on this portfolio website uses [Formspree](https://formspree.io/) to handle form submissions. Formspree is a free service that allows you to handle form submissions without writing any backend code.

## Current Configuration
The form is currently configured with a placeholder Formspree endpoint: `https://formspree.io/f/xdkokykj`

**⚠️ Important:** You need to replace this with your own Formspree endpoint to receive messages.

## Setup Instructions

### 1. Create a Formspree Account
1. Go to [formspree.io](https://formspree.io/)
2. Sign up for a free account
3. Verify your email address

### 2. Create a New Form
1. After logging in, click "New Form"
2. Enter your email address where you want to receive messages
3. Give your form a name (e.g., "Portfolio Contact Form")
4. Click "Create Form"

### 3. Get Your Form Endpoint
1. After creating the form, you'll see your form endpoint
2. It will look like: `https://formspree.io/f/YOUR_FORM_ID`
3. Copy this URL

### 4. Update the Contact Form
1. Open `index.html` in your code editor
2. Find the contact form section (around line 430)
3. Replace the current action URL:
   ```html
   <form class="contact-form" id="contact-form" action="https://formspree.io/f/xdkokykj" method="POST">
   ```
   With your new endpoint:
   ```html
   <form class="contact-form" id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### 5. Update the Redirect URL (Optional)
In the same form, update the `_next` hidden field to match your website URL:
```html
<input type="hidden" name="_next" value="https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/#contact">
```

### 6. Test the Form
1. Deploy your website to GitHub Pages
2. Fill out and submit the contact form
3. Check your email for the message
4. Go to your Formspree dashboard to see the submission

## Features Included

### Spam Protection
- **Honeypot field**: Hidden field that bots often fill out, helping to filter spam
- **reCAPTCHA**: Formspree automatically includes reCAPTCHA protection on the free plan

### Form Validation
- Client-side validation for required fields
- Email format validation
- Real-time error display
- Success/error message handling

### Accessibility
- Proper form labels and ARIA attributes
- Keyboard navigation support
- Screen reader announcements

## Free Plan Limitations
- 50 submissions per month
- Formspree branding in emails
- Basic spam filtering

## Upgrade Options
For higher volume or additional features, Formspree offers paid plans with:
- Unlimited submissions
- No branding
- Advanced spam filtering
- Custom email templates
- File uploads

## Alternative Services
If you prefer other form handling services, you can easily modify the form to work with:
- [Netlify Forms](https://www.netlify.com/products/forms/)
- [EmailJS](https://www.emailjs.com/)
- [Getform](https://getform.io/)
- [Typeform](https://www.typeform.com/)

## Troubleshooting

### Form Not Submitting
1. Check that the form action URL is correct
2. Ensure your Formspree form is verified
3. Check browser console for JavaScript errors

### Not Receiving Emails
1. Check your spam folder
2. Verify your email address in Formspree dashboard
3. Check Formspree submission logs

### Validation Errors
1. Ensure all required fields are filled
2. Check email format is valid
3. Look for client-side validation messages

## Security Notes
- Never expose sensitive API keys in client-side code
- The form includes CSRF protection through Formspree
- All submissions are logged in your Formspree dashboard
- Consider adding additional rate limiting for high-traffic sites

---

For more information, visit the [Formspree documentation](https://help.formspree.io/).
