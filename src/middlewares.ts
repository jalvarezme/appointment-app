import { jwtVerify } from "https://deno.land/x/jose@v5.2.0/index.ts";
import { Next } from "hono/types";
import { Context } from "hono";
import { SECRET_JWT } from "./const.ts";

export const jwtMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        message: "Unauthorized: No token provided",
        error: true,
        status: 401,
        data: null,
      },
      401
    );
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const secret = new TextEncoder().encode(await SECRET_JWT);
    const { payload } = await jwtVerify(token, secret);

    c.set("jwtPayload", payload);
    await next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return c.json(
      {
        message: "Unauthorized: Invalid or expired token",
        error: true,
        status: 401,
        data: null,
      },
      401
    );
  }
};
