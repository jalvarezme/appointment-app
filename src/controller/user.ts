import { Context, Hono } from "hono";
import UserService from "../services/User.ts";
import { jwtMiddleware } from "../middlewares.ts";

export const UserController = new Hono();

UserController.use("*", jwtMiddleware); // trasnform to decorator

UserController.get("/getAllUser", async (c: Context) => {
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

UserController.get("/getAllDoctors", async (c: Context) => {
  try {
    const listUser = await UserService.fetchAllDoctor();
    return c.json({
      message: "Successfully getAllDoctor",
      error: false,
      status: 200,
      data: listUser,
    });
  } catch (error) {
    console.error("Error during getAllDoctor:", error);
    return c.json({
      message: "Internal server error, getAllDoctor",
      error: true,
      status: 500,
      data: null,
    });
  }
});

UserController.get("/:id", async (c: Context) => {   
  try {
    const id = c.req.param("id");
    const listUser = await UserService.fetchUserById(id);
    return c.json({
      message: "Successfully getAllDoctor",
      error: false,
      status: 200,
      data: listUser,
    });
  } catch (error) {
    console.error("Error during getAllDoctor:", error);
    return c.json({
      message: "Internal server error, getAllDoctor",
      error: true,
      status: 500,
      data: null,
    });
  }
});