import { Hono } from "hono";
import { UserController } from "./controller/user.ts";
import { AppointmentController } from "./controller/appointment.ts";
import Auth from "./controller/auth.ts";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api/v1");

app.use("*", cors());

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
