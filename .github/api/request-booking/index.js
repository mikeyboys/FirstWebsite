const sgMail = require('@sendgrid/mail');

module.exports = async function (context, req) {
    // Set the SendGrid API Key from your Azure Function's Application Settings
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Get the form data from the request
    const { name, email, phone, message } = req.body;

    // Basic validation to ensure required fields are present
    if (!name || !email || !message) {
        context.res = {
            status: 400,
            body: "Please provide a name, email, and message."
        };
        return;
    }

    // Construct the email content
    const emailContent = `
        <h2>New Consultation Request from staffapps.com.au</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `;

    // Create the email message object for SendGrid
    const msg = {
        to: 'michael.boys@staffapps.com.au', // Your email address where you'll receive notifications
        from: 'website@staffapps.com.au',   // A verified sender email in your SendGrid account
        subject: `New Consultation Request from ${name}`,
        html: emailContent,
    };

    try {
        // Try to send the email
        await sgMail.send(msg);
        context.res = {
            status: 200,
            body: "Thank you! Your request has been sent successfully."
        };
    } catch (error) {
        console.error('SendGrid Error:', error.toString());
        context.res = {
            status: 500,
            body: "Sorry, there was an error sending your message. Please try again later."
        };
    }
};