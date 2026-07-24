require("dotenv").config();
const { sendMail } = require("../services/mail.service");

(async () => {
  try {
    const info = await sendMail({
      to: "ajayshakya7376@gmail.com",
      subject: "suiiiii we are goint extraa ordinary email from UmbraVault",
      html: "<h1>It works 🎉</h1><p>This is a dummy test email.</p>",
    });
    console.log("Mail sent:", info.messageId);
    process.exit(0);
  } catch (err) {
    console.error("Mail failed:", err.message);
    process.exit(1);
  }
})();
