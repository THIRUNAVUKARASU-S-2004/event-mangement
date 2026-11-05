import { SQL } from "bun";

export const pg = new SQL(process.env.DATABASE_URL);
