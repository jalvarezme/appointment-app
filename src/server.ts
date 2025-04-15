import { Hono } from "hono";
import { UserController } from "./controller/user.ts";
import { AppointmentController } from "./controller/appointment.ts";
import Auth from "./controller/auth.ts";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api/v1");

console.log(`${Deno.env.get("WEBSITE_URL")}`);

app.use("*", cors({
  origin: `${Deno.env.get("WEBSITE_URL")}`, // Allow requests from this origin
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowHeaders: ['Content-Type', 'Authorization'], // Allow all headers
  exposeHeaders: ['*'], // Expose all headers
  credentials: true, // Allow credentials if needed
  // maxAge: 86400, // Cache CORS preflight for 24 hours
}));

app.route("user", UserController);

app.route("/auth/", Auth);

app.route("/appoinment", AppointmentController);

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

app.onError((err, c) => {
  console.log(err);
  return c.json({
    message: "Internal Server Error",
    error: true,
    status: 500,
    data: null,
  }, 500);
});

Deno.serve(app.fetch);
