const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const validator = require('validator');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve the download page
app.get('/download', (req, res) => {
    res.sendFile(__dirname + '/download.html');
});

// Generate QR code and redirect to the download page
app.post('/generate', (req, res) => {
    const { name, email, whatsapp, fbProfile, ytProfile, tiktokProfile } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
        return res.send('Invalid email address.');
    }

    // Format WhatsApp link
    const whatsappLink = `https://wa.me/${whatsapp}`;

    // Create a data string to encode into the QR code
    const data = `
        Name: ${name}
        Email: ${email}
        WhatsApp: ${whatsappLink}
        Facebook: ${fbProfile}
        YouTube: ${ytProfile}
        TikTok: ${tiktokProfile}
    `;

    // Generate QR code
    QRCode.toDataURL(data, (err, qrCodeData) => {
        if (err) {
            return res.send('Error generating QR code.');
        }

        // Redirect to the download page with the QR code and name as query parameters
        const query = `?name=${encodeURIComponent(name)}&qrCode=${encodeURIComponent(qrCodeData)}`;
        res.redirect(`/download${query}`);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
