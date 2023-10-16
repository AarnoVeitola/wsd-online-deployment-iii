import { sql } from "../database/database.js";

const create = async (sender, message) => {
    await sql`INSERT INTO messages (sender, message) 
        VALUES (${ sender }, ${ message })`;
};

const findRecent = async () => {
    return await sql`SELECT * FROM messages ORDER BY id DESC LIMIT 5`;
};

export { create, findRecent };