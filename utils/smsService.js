import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSms = async (to, message) => {
    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });
        console.log(`✅ SMS Sent to ${to}: ${message}`);
    } catch (error) {
        console.error("❌ SMS Error:", error);
    }
};
 
