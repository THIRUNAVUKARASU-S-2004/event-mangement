import crypto from "crypto";
import { createUser, findUserByEmail } from "../Repository/UserRepository.js";
import { hashPassword, vefifyPassword } from "../../utils/passwordUtil.js";
import { createSession, deleteSessionByEmail } from "../Repository/SessionRepository.js";

export const authRegisterService = async (email, password, name, age) => {
    const hasedPassword = await hashPassword(password);
    const id = crypto.randomUUID();

    const [user] = await createUser(id, email, hasedPassword, name, age);

    return user;
};

export const authLoginService = async (email, password) => {
    const [user] = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email");
    }

    const isPasswordValid = await vefifyPassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const sessionId = crypto.randomUUID();

    await createSession(sessionId, user.id);

    return {
        user,
        sessionId
    };
};

export const authLogoutService = async (email, password) => {
    const [user] = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email");
    }

    const isPasswordValid = await vefifyPassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    await deleteSessionByEmail(email);
};