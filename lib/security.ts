import crypto from "crypto";

export function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

export function getClientIP(
  forwardedFor?: string,
  clientIP?: string
): string {
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return clientIP || "127.0.0.1";
}

export async function verifyTurnstile(
  token: string,
  secretKey: string
): Promise<boolean> {
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch {
    console.error("Turnstile verification failed:", {});
    return false;
  }
}

export function generateSecretKey(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
