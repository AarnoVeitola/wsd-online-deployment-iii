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

const listMessages = async () => {
  const data = {
    messages: await messageService.findLastFiveMessages(),
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};

const addMessage = async (request) => {
  const formData = await request.formData();
  const sender = formData.get("sender");
  const message = formData.get("message");

  await messageService.create(sender, message);
};

const handleRequest = async (request) => {
  if (request.method === "GET") {
    return await listMessages();
  } else if (request.method === "POST") {
    await addMessage(request);
    return redirectTo("/");
  }
};

serve(handleRequest, { port: 7777 });