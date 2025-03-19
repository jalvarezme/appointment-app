import { Hono } from "hono";
import { setCookie } from "hono/cookie";

import { OAUTH2CLIENT, ROLE, SECRET_JWT } from "../const.ts";
import UserService from "../services/User.ts";
import { UserProfile } from "../types/User.ts";
import {  create } from "https://deno.land/x/djwt@v2.9/mod.ts";

export const Auth = new Hono();

Auth.get("google", (c) => {
  const authUrl = OAUTH2CLIENT.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  return c.redirect(authUrl);
});

Auth.get("google/callback", async (c): Promise<Response> => {
  const { code } = c.req.query();

  if (!code) {
    return c.json({
      message: "Error during Google OAuth",
      error: true,
      status: 400,
      data: null,
    });
  }

  try {
    const { tokens } = await OAUTH2CLIENT.getToken(code);
    OAUTH2CLIENT.setCredentials(tokens);

    return c.json({
      message: "User authenticated successfully",
      error: false,
      status: 200,
      data: {
        token: tokens.access_token,
        expiry_date: tokens.expiry_date,
      },
    });
  } catch (error) {
    console.error("Error during Google OAuth:", error);
    return c.json({
      message: "Internal server error",
      error: true,
      status: 500,
      data: null,
    });
  }
});

Auth.post("", async (c) => {
  try {
    const body = await c.req.json();
    const user = await UserService.fetchAuthUser(body?.token);

    if (user?.error) {
      throw Error("Invalid token");
    }

    const UserProfile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      photo: user.picture,
      rol: ROLE.USER,
    };

    const payload = {
      UserProfile,
      exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 hours
    };

    const secret = await SECRET_JWT;
    const token = await create({ alg: "HS256", typ: "JWT" }, payload, secret);

    setCookie(c, "token", token, {
      httpOnly: true,
      secure: true, // Enable in production (HTTPS only)
      maxAge: 12 * 60 * 60, // 12 hours
      path: "/",
      sameSite: "Strict", // Prevent CSRF attacks
    });

    return c.json({
      message: "User authenticated successfully",
      error: false,
      status: 200,
      data: {
        user: await UserService.register(UserProfile),
      },
    });
  } catch (error) {
    console.error("Error during getting user auth:", error);
    return c.json({
      message: "Internal server error",
      error: true,
      status: 500,
      data: null,
    });
  }
});
