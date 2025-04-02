import { verify } from "https://deno.land/x/djwt@v2.9/mod.ts"; // For JWT verification
import { Next } from "hono/types";
import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { SECRET_JWT } from "./const.ts";

export const jwtMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, "token");
  if (!token) {
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
