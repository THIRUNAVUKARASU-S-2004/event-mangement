import { pg } from "../config/db.js";

const deleteExpiredSessions = async () => {
    try {
        await pg`DELETE FROM sessions WHERE expires_at <= NOW()`;
        console.log("Expired sessions cleaned up");
    } catch (err) {
        console.log(err);
    }
}

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export const startSessionCleanup = () => {
    setInterval(deleteExpiredSessions, TWELVE_HOURS);
}