import { verify } from "https://deno.land/x/djwt@v2.9/mod.ts"; // For JWT verification
import { Next } from "hono/types";
import { Context } from "hono";
import { SECRET_JWT } from "./const.ts";

export const jwtMiddleware = async (c: Context, next: Next) => {
  // Get token from Authorization header
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json(
      {
        message: "Unauthorized: No token provided",
        error: true,
        status: 401,
        data: null,
      },
      401,
    );
  }

  // Expecting "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return c.json(
      {
        message: "Unauthorized: Malformed token",
        error: true,
        status: 401,
        data: null,
      },
      401,
    );
  }

  try {
    const payload = await verify(token, await SECRET_JWT);
    c.set("jwtPayload", payload);
    await next();
  } catch (err) {
    console.log(err);
    return c.json({
      message: "Unauthorized: Invalid or expired token",
      error: true,
      status: 401,
      data: null,
    }, 401);
  }
};