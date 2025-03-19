import { OAuth2Client } from "google-auth-library";
import { CriptoKey } from "./helpers.ts";


export const GOOGLE_OPTIONS = {
  clientId: Deno.env.get("GOOGLE_CLIENT_ID") || "",
  clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET") || "",
  redirectUri: Deno.env.get("GOOGLE_REDIRECT_URI") || "",
};

export const SECRET_JWT = CriptoKey(Deno.env.get("GOOGLE_CLIENT_SECRET") || "");

export const OAUTH2CLIENT = new OAuth2Client({...GOOGLE_OPTIONS});

export const ROLE = {
  ADMIN: "admin",
  USER: "user",
  DOCTOR: "doctor",
  RECEPTIONIST: "receptionist",
};

export const TOKEN_PATH = "./token.json";