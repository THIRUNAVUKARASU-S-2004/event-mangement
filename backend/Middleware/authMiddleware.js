import { isValidSession } from "../Quiz/Repository/SessionRepository.js";


export const authenticate = async (req, res, next) => {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
        return res.status(401).json({ message: "Unauthorized: no session" });
    }

    try {
        const isSessionValid = await isValidSession(sessionId);

        if (!isSessionValid) {
            return res.status(401).json({ message: "Unauthorized: session expired or invalid" });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}