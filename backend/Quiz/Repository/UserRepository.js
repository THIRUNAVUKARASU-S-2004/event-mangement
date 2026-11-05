import { pg } from "../../config/db.js";

export const createUser = async (id, email, password, name, age) => {
    const user = await pg`INSERT INTO USERS(id, email, password, name, age) 
    VALUES(${id}, ${email}, ${password}, ${name}, ${age})`;
    return user;
}

export const findUserByEmail = async (email) => {
    const user = await pg`SELECT * FROM users WHERE email=${email}`;
    return user;
}