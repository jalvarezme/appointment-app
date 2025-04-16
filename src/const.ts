import { OAuth2Client } from "google-auth-library";
import { CriptoKey } from "./helpers.ts";

export const GOOGLE_OPTIONS = {
  clientId: Deno.env.get("GOOGLE_CLIENT_ID") || "",
  clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET") || "",
  redirectUri: Deno.env.get("GOOGLE_REDIRECT_URI") || "",
};

export const SECRET_JWT = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";

export const OAUTH2CLIENT = new OAuth2Client({...GOOGLE_OPTIONS});

export const ROLE = {
  ADMIN: "admin",
  USER: "user",
  DOCTOR: "doctor",
  RECEPTIONIST: "receptionist",
};

export const BIG_QUERY_CRED = {
  "type": Deno.env.get("GOOGLE_BIGQUERY_TYPE"),
  "project_id": Deno.env.get("GOOGLE_BIGQUERY_PROJECT_ID"),
  "private_key_id": Deno.env.get("GOOGLE_BIGQUERY_PRIVATE_KEY_ID"),
  "private_key": Deno.env.get("GOOGLE_BIGQUERY_PRIVATE_KEY"),
  "client_email": Deno.env.get("GOOGLE_BIGQUERY_CLIENT_EMAIL"),
  "client_id": Deno.env.get("GOOGLE_BIGQUERY_CLIENT_ID"),
  "auth_uri": Deno.env.get("GOOGLE_BIGQUERY_AUTH_URI"),
  "token_uri": Deno.env.get("GOOGLE_BIGQUERY_TOKEN_URI"),
  "auth_provider_x509_cert_url": Deno.env.get("GOOGLE_BIGQUERY_AUTH_PROVIDER_X509_CERT_URL"),
  "client_x509_cert_url": Deno.env.get("GOOGLE_BIGQUERY_CLIENT_X509_CERT_URL"),
  "universe_domain": Deno.env.get("GOOGLE_BIGQUERY_UNIVERSE_DOMAIN"),
};

export const TOKEN_PATH = "./token.json";