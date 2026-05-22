const transpoter = require("../services/SendMail");

const SendEmail = async ({ to, subject, html }) => {
  try {
    await transpoter.sendMail({
      from: process.env.BREVO_EMAIL,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const emailHeader = () => `
<div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-bottom: 4px solid #f59e0b;">
  <h1 style="color: #f59e0b; margin: 0; font-size: 28px;">SIRINI</h1>
  <p style="color: #a3a3a3;">Hotel & Restaurant</p>
</div>
`;

const emailFooter = () => `
<div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
  <p style="color: #6b7280; margin: 0; font-size: 12px;">
    If you have any questions, please contact us.
  </p>
</div>
`;

const sendRestaurantOrderEmail = async ({
  email,
  fullName,
  savedOrder,
  foodName,
  portion,
  quantity,
  Price,
  pickupDate,
  pickupTime,
  phoneNumber,
}) => {
  try {
    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #f0f0f0;">
        ${emailHeader()}
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Order Confirmation</h2>
           <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Ref:${savedOrder.orderCode}</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Dear <strong>${fullName}</strong>,</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Thank you for your order! Your request has been received and is currently <strong>${savedOrder.status}</strong>.</p>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1a1a1a; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Order Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Order Code</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${savedOrder.orderCode}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Item</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${foodName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Portion</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${portion}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Quantity</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${quantity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Price</td>
                <td style="padding: 8px 0; color: #f59e0b; font-size: 16px; font-weight: bold; text-align: right;">Rs. ${Price}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px 20px; margin-bottom: 30px;">
            <h4 style="color: #b45309; margin: 0 0 10px 0; font-size: 16px;">Pickup Information</h4>
            <p style="color: #92400e; margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${pickupDate}</p>
            <p style="color: #92400e; margin: 5px 0; font-size: 14px;"><strong>Time:</strong> ${pickupTime}</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <h4 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">Customer Information</h4>
            <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${phoneNumber}</p>
            <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
          </div>
        </div>
        
        ${emailFooter()}
      </div>
    `;

    await SendEmail({
      to: email,
      subject: "Your Sirini Restaurant Order Confirmation",
      html: htmlTemplate,
    });
    console.log("Restaurant order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending restaurant order email:", error);
  }
};

const sendRoomBookingEmail = async ({
  name,
  email,
  phone,
  checkInDate,
  checkOutDate,
  roomNumber,
  numberOfGuests,
  totalAmount,
  timeSlot,
  status,
  newRoomBooking,
}) => {
  try {
    const formatDt = (dt) =>
      new Date(dt).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    const inDate = formatDt(checkInDate);
    const outDate = formatDt(checkOutDate);

    const slotLabel =
      timeSlot === "day" ? "Day Package (12:00 PM - 3:00 PM)" : "Full Day";

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #f0f0f0;">
        ${emailHeader()}
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Room Booking Confirmation</h2>
          <h2>Ref: ${newRoomBooking.bookingCode}</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Thank you for your booking! Your request has been received and is currently <strong>${status}</strong>.</p>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1a1a1a; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Booking Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Room Number</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${roomNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time Slot</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${slotLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Guests</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${numberOfGuests}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Amount</td>
                <td style="padding: 8px 0; color: #f59e0b; font-size: 16px; font-weight: bold; text-align: right;">Rs. ${totalAmount}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px 20px; margin-bottom: 30px;">
            <h4 style="color: #b45309; margin: 0 0 10px 0; font-size: 16px;">Stay Information</h4>
            <p style="color: #92400e; margin: 5px 0; font-size: 14px;"><strong>Check-In:</strong> ${inDate}</p>
            <p style="color: #92400e; margin: 5px 0; font-size: 14px;"><strong>Check-Out:</strong> ${outDate}</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <h4 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">Customer Information</h4>
            <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${phone}</p>
            <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
          </div>
        </div>
        
        ${emailFooter()}
      </div>
    `;

    await SendEmail({
      to: email,
      subject: "Your Sirini Room Booking Confirmation",
      html: htmlTemplate,
    });
    console.log("Room booking confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending room booking email:", error);
  }
};

const sendAppointmentEmail = async ({
  name,
  email,
  phone,
  date,
  noOfGuests,
  eventType,
  status,
  newAppointment,
}) => {
  try {
    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #f0f0f0;">
        ${emailHeader()}
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Reception Appointment Confirmation</h2>
          <h2>Ref: ${newAppointment.appointcode}</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Thank you for your appointment request! We have received it and it is currently <strong>${status}</strong>.</p>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1a1a1a; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Appointment Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Event Type</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${eventType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Expected Guests</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${noOfGuests}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px 20px; margin-bottom: 30px;">
            <h4 style="color: #b45309; margin: 0 0 10px 0; font-size: 16px;">Date Information</h4>
            <p style="color: #92400e; margin: 5px 0; font-size: 14px;"><strong>Appointment Date:</strong> ${date}</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <h4 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">Customer Information</h4>
            <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${phone}</p>
            <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
          </div>
        </div>
        ${emailFooter()}
      </div>
    `;

    await SendEmail({
      to: email,
      subject: "Your Sirini Reception Appointment Confirmation",
      html: htmlTemplate,
    });
    console.log("Appointment confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending appointment email:", error);
  }
};

const sendReceptionhallBookingEmail = async ({ newBooking }) => {
  try {
    const formatDt = (dt) =>
      new Date(dt).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    const eventDateFormatted = formatDt(newBooking.eventDate);

    const shiftLabel =
      newBooking.eventTime === "day"
        ? "Day Function (9:00 AM - 4:00 PM)"
        : "Night Function (7:00 PM - 1:00 AM)";

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #f0f0f0;">
        ${emailHeader()}
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Reception Hall Booking Confirmation</h2>
          <h2>Ref: ${newBooking.refnumber}</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Dear <strong>${newBooking.customerName}</strong>,</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Thank you for choosing us for your special day! Your reception hall reservation has been received and is currently <strong>${newBooking.status}</strong>.</p>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1a1a1a; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Reservation Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Selected Package</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${newBooking.selectedPackage}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time Shift Slot</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${shiftLabel}</td>
              </tr>
               <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Event Type</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${newBooking.eventType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Expected Guests Count</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${newBooking.numberOfGuests} Guests</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payed:</td>
                <td style="padding: 8px 0; color: #f59e0b; font-size: 16px; font-weight: bold; text-align: right;">Rs. ${newBooking.amountPayed}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px 20px; margin-bottom: 30px;">
            <h4 style="color: #b45309; margin: 0 0 10px 0; font-size: 16px;">Celebration Time & Venue</h4>
            <p style="color: #92400e; margin: 5px 0; font-size: 14px;"><strong>Event Date:</strong> ${eventDateFormatted}</p>
            <p style="color: #92400e; margin: 5px 0; font-size: 14px;"><strong>Event Shift Timing:</strong> ${shiftLabel}</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <h4 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 16px;">Contact Information</h4>
            <p style="color: #4b5563; margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${newBooking.customerPhone}</p>
          </div>
        </div>
        
        ${emailFooter()}
      </div>
    `;

    await SendEmail({
      to: newBooking.customerEmail,
      subject: "Your Sirini Reception Hall Booking Confirmation",
      html: htmlTemplate,
    });
    console.log(
      "Reception hall booking confirmation email dispatched successfully",
    );
  } catch (error) {
    console.error("Error sending reception hall booking email:", error);
  }
};

module.exports = {
  SendEmail,
  sendRestaurantOrderEmail,
  sendRoomBookingEmail,
  sendAppointmentEmail,
  sendReceptionhallBookingEmail,
};
