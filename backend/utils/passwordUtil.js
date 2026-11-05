export const hashPassword = async (password) => {
    return await Bun.password.hash(password);
}

export const vefifyPassword = async (password, hashedPassword) => {
    return await Bun.password.verify(password, hashedPassword);
}