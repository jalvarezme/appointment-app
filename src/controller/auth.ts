import { Hono } from "hono";
import { setCookie } from "hono/cookie";

import { OAUTH2CLIENT, ROLE, SECRET_JWT } from "../const.ts";
import UserService from "../services/User.ts";
import { UserProfile } from "../types/User.ts";
import { create } from "https://deno.land/x/djwt@v2.9/mod.ts";

const Authentication = new Hono();

Authentication.get("google", (c) => {
  const authUrl = OAUTH2CLIENT.generateAuthUrl(
    {
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/calendar",
      ],
    },
  );
  return c.redirect(authUrl);
});

Authentication.get("google/callback", async (c): Promise<Response> => {
  const { code } = c.req.query();

  if (!code) {
    const html = `
      <script>
        window.opener.postMessage(${
      JSON.stringify({
        message: "Error during Google OAuth",
        error: true,
        status: 400,
        data: null,
      })
    }, "http://localhost:4321");
      </script>
    `;
    return c.html(html);
  }

  try {
    const { tokens } = await OAUTH2CLIENT.getToken(code);
    OAUTH2CLIENT.setCredentials(tokens);

    // we can do this, or the redirect  return c.redirect('http://localhost:4321?token=your_token');
    const html = `
      <script>
        window.opener.postMessage(${
      JSON.stringify({
        message: "Google credentials successfully",
        error: false,
        status: 200,
        data: {
          token: tokens.access_token,
          expiry_date: tokens.expiry_date,
        },
      })
    }, "http://localhost:4321");
      </script>
    `;
    return c.html(html);
  } catch (error) {
    console.error("Error during Google OAuth:", error);

    const html = `
      <script>
        window.opener.postMessage(${
      JSON.stringify({
        message: "Internal server error",
        error: true,
        status: 500,
        data: null,
      })
    }, "http://localhost:4321");
      </script>
    `;
    return c.html(html);
  }
});

Authentication.post("signup", async (c) => {
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
      user: {
        ...UserProfile,
        token: body?.token,
      },
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
      message: "User registred successfully",
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

Authentication.post("signin", async (c) => {
  try {
    const body = await c.req.json();
    const user = await UserService.fetchAuthUser(body?.token);

    if (user?.error) {
      throw Error("Invalid token");
    }

    const userInfo = await UserService.fetchUserById(user.id);

    if (!userInfo) {
      throw Error("Invalid userID, not registred");
    }

    const payload = {
      user: {
        ...userInfo,
        token: body?.token,
      },
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
        user: userInfo,
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

export default Authentication;
