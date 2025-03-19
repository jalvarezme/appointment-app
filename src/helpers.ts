export async function CriptoKey(key: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}
