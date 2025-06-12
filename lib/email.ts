import nodemailer from "nodemailer";

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

interface UserRegistrationData {
  name: string;
  email: string;
  phone: string;
  company_id: string;
}

export async function sendUserRegistrationEmail(
  userData: UserRegistrationData
) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email to receive notifications
      subject: `New User Registration - ${userData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            New User Registration
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4CAF50; margin-top: 0;">User Information:</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 8px 0;">${userData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0;">${userData.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px 0;">${userData.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Company ID:</td>
                <td style="padding: 8px 0;">${userData.company_id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Registration Date:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This is an automated notification from your application.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Registration email sent successfully");
  } catch (error) {
    console.error("Error sending registration email:", error);
    // Don't throw error to prevent signup failure due to email issues
  }
}

interface AppointmentData {
  name: string;
  phone: string;
  email?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  service: string;
  status: string;
  user_instagram_id?: string;
  company_instagram_id?: string;
  notes?: string;
}

export async function sendAppointmentCreatedEmail(
  appointmentData: AppointmentData
) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Appointment Created - ${appointmentData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px;">
            New Appointment Created
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2196F3; margin-top: 0;">Appointment Details:</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Client Name:</td>
                <td style="padding: 8px 0;">${appointmentData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px 0;">${appointmentData.phone}</td>
              </tr>
              ${
                appointmentData.email
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0;">${appointmentData.email}</td>
              </tr>
              `
                  : ""
              }
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Service:</td>
                <td style="padding: 8px 0;">${appointmentData.service}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
                <td style="padding: 8px 0;">${new Date(
                  appointmentData.date
                ).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Time:</td>
                <td style="padding: 8px 0;">${new Date(
                  appointmentData.startTime
                ).toLocaleTimeString()} - ${new Date(
        appointmentData.endTime
      ).toLocaleTimeString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Status:</td>
                <td style="padding: 8px 0;">${appointmentData.status}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Created:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This is an automated notification from your appointment system.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Appointment created email sent successfully");
  } catch (error) {
    console.error("Error sending appointment created email:", error);
  }
}

export async function sendAppointmentUpdatedEmail(
  appointmentData: AppointmentData,
  updateType: string = "updated"
) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `Appointment ${
        updateType.charAt(0).toUpperCase() + updateType.slice(1)
      } - ${appointmentData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #FF9800; padding-bottom: 10px;">
            Appointment ${
              updateType.charAt(0).toUpperCase() + updateType.slice(1)
            }
          </h2>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF9800;">
            <h3 style="color: #FF9800; margin-top: 0;">Updated Appointment Details:</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Client Name:</td>
                <td style="padding: 8px 0;">${appointmentData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px 0;">${appointmentData.phone}</td>
              </tr>
              ${
                appointmentData.email
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0;">${appointmentData.email}</td>
              </tr>
              `
                  : ""
              }
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Service:</td>
                <td style="padding: 8px 0;">${appointmentData.service}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
                <td style="padding: 8px 0;">${new Date(
                  appointmentData.date
                ).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Time:</td>
                <td style="padding: 8px 0;">${new Date(
                  appointmentData.startTime
                ).toLocaleTimeString()} - ${new Date(
        appointmentData.endTime
      ).toLocaleTimeString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Status:</td>
                <td style="padding: 8px 0;">${appointmentData.status}</td>
              </tr>
              ${
                appointmentData.notes
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Notes:</td>
                <td style="padding: 8px 0;">${appointmentData.notes}</td>
              </tr>
              `
                  : ""
              }
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Updated:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This is an automated notification from your appointment system.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Appointment ${updateType} email sent successfully`);
  } catch (error) {
    console.error(`Error sending appointment ${updateType} email:`, error);
  }
}
