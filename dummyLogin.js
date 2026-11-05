import express from "express";

const router = express.Router();
router.use(express.json());

const users = [
    { name: "Thirunavukarasu" }
];

const sessions = {};

router.post("/login", (req, res) => {
    const rawName = req.query.name;

    if (!rawName) {
        return res.status(400).send("Please provide name");
    }

    const name = String(rawName).replace(/^['"]|['"]$/g, "").trim();

    let found = false;

    for (const user of users) {
        if (user.name === name) {
            found = true;
            break;
        }
    }

    if (!found) {
        return res.status(401).send("User is not authorized");
    }

    const sessionId = crypto.randomUUID();
    sessions[sessionId] = { sessionId, name };
    res.set("Set-Cookie", `session=${sessionId}; Path=/; HttpOnly`);

    return res.status(200).send("Login successfull");
});

export const isLoggedIn = (req, res, next) => {
    // 1. Read cookie header (e.g., "session=123-abc")
    const cookieHeader = req.headers.cookie;
    const sessionId = cookieHeader
        ?.split(";")
        .find((c) => c.trim().startsWith("session="))
        ?.split("=")[1];

    // 2. Check if sessionId exists in sessions store
    if (!sessionId || !sessions[sessionId]) {
        return res.status(401).send("Please login");
    }

    // 3. Attach user/session to req for subsequent handlers
    req.session = sessions[sessionId];

    // 4. Pass control to the next handler
    next();
};

router.post("/register", (req, res) => {
    const rawName = req.query.name || req.body?.name;
    if (!rawName) {
        return res.status(400).send("Please provide name");
    }
    const name = String(rawName).replace(/^['"]|['"]$/g, "").trim();
    const id = crypto.randomUUID();
    const user = { id, name };
    users.push(user);
    return res.status(201).json({
        message: "User created successfully",
        user: user
    });
});

export default router;
