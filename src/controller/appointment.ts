import { Context, Hono } from "hono";
import { jwtMiddleware } from "../middlewares.ts";
import Appointment from "../services/Appointment.ts";

export const AppointmentController = new Hono();

AppointmentController.use("*", jwtMiddleware); // trasnform to decorator

AppointmentController.get("/getAllAppointment/", async (c: Context) => {
  try {
    const token = c.get("jwtPayload")?.user?.token; // get token from jwt payload
    const listAppoinment = await Appointment.fetchAppointments(token);

    return c.json({
      message: "Successfully getAllAppoinment",
      error: false,
      status: 200,
      data: listAppoinment,
    });
  } catch (error) {
    console.error("Error during getAllAppoinment:", error);
    return c.json({
      message: "Internal server error, getAllAppoinment",
      error: true,
      status: 500,
      data: null,
    });
  }
});