import { serve } from "https://deno.land/std@0.202.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";
import * as messageService from "./services/messageService.js";


configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const addMessage = async (request) => {
  const formData = await request.formData();

  const sender = formData.get("sender");
  const message = formData.get("message");

  await messageService.create(sender, message);
  
  return redirectTo("/");
};

const listMessages = async (request) => {
  const data = {
    messages: await messageService.findRecent(),
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
}


const handleRequest = async (request) => {
  const url = new URL(request.url);
  if (url.pathname === "/" && request.method === "GET") {
    return await listMessages(request);
  } else if (url.pathname === "/" && request.method === "POST") {
    return await addMessage(request);
  }
  return redirectTo("/");
};

serve(handleRequest, { port: 7777 });