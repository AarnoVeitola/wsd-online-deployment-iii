import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";
import { sql } from "./database/database.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const data = {
  count: 0,
};

const handleRequest = async (request) => {
  const url = new URL(request.url);
  if (url.pathname === "/count") {
    data.count++;
    return new Response(await renderFile("count.eta", data), responseDetails);
  }

  if (url.pathname === "/addresses") {
    const rows = await sql`SELECT COUNT(*) as count FROM addresses`;
    let rowCount = -42;
    if (rows.length > 0) {
      rowCount = rows[0].count;
    }

    return new Response(`Total rows: ${rowCount}`);
  }

  return new Response("Hello you!");
};

serve(handleRequest, { port: 7777 });