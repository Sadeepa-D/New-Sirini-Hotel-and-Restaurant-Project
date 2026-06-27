const {Resend}= require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, subject, html) => {
  try{
  const data= await resend.emails.send({
    from: `Sirini Hotel <${process.env.FROM_EMAIL}>`,
    to: to,
    subject: subject,
    html: html,
  });
  console.log("Email sent successfully:");
    return data;
}catch (error) {
  console.log(error);
  throw new Error("Failed to send email");
}
}

module.exports = sendMail;
