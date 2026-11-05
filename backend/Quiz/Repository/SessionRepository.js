import { pg } from "../../config/db.js";
import { findUserByEmail } from "./UserRepository.js";

export const createSession = async (sessionId, userId) => {
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
    await pg`INSERT INTO sessions(session_id, user_id, expires_at) VALUES(${sessionId}, ${userId}, ${expiresAt})`;
}

export const isValidSession = async (sessionId) => {
    const session = await pg`SELECT * FROM sessions WHERE session_id = ${sessionId} AND expires_at    
     > NOW()`;

    return session.length == 0 ? false : true;
}

export const deleteSessionByEmail = async (email) => {
    const [user] = await findUserByEmail(email);

    if (!user) {
        throw new Error("User dosen't has a session");
    }

    await pg`DELETE FROM sessions WHERE user_id = ${user.id}`;
};