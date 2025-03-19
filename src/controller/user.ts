import { Context, Hono } from "hono";
import UserService from "../services/User.ts";
import { jwtMiddleware } from "../../middlewares.ts";

export const UserController = new Hono();

UserController.use("*", jwtMiddleware); // trasnform to decorator

UserController.get("/", async (c: Context) => {
  try {
    const listUser = await UserService.fetchAllUser();
    return c.json({
      message: "Successfully getAllUser",
      error: false,
      status: 200,
      data: listUser,
    });
  } catch (error) {
    console.error("Error during getAllUser:", error);
    return c.json({
      message: "Internal server error, getAllUser",
      error: true,
      status: 500,
      data: null,
    });
  }
});

UserController.post("/", (c: Context) => {
  return c.text("Hello User Post endpoint");
});
