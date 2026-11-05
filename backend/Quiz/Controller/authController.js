import { authRegisterService, authLoginService, authLogoutService } from "../Service/authService.js";

export const authRegisterController = async (req, res) => {
    try {
        const { email, password, name, age } = req.body;

        const user = await authRegisterService(email, password, name, age);

        return res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }

};

export const authLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await authLoginService(email, password);

        res.cookie("session", result.sessionId, {
            path: "/",
            httpOnly: true,
            maxAge: 12 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "Logged in successfully",
            user: result.user
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
}

export const authLogoutController = async (req, res) => {
    try {
        const { email, password } = req.body;

        await authLogoutService(email, password);

        return res.status(204).send("Logged out successfully");
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
}