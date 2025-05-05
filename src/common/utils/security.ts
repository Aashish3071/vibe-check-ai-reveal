import { supabase } from "@/common/lib/supabase";

// Input sanitization
export function sanitizeInput(input: string): string {
  // First remove HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, "");

  // Then escape special characters
  return withoutTags.replace(/[&<>"']/g, (char) => {
    const escape: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return escape[char];
  });
}

// Password strength validation
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!hasLowerCase) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!hasNumbers) {
    errors.push("Password must contain at least one number");
  }
  if (!hasSpecialChar) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Rate limiting
export class RateLimiter {
  private requests: Map<string, number[]>;
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.requests = new Map();
    this.limit = limit;
    this.windowMs = windowMs;
  }

  public isAllowed(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    const windowStart = now - this.windowMs;

    // Remove old requests
    const recentRequests = userRequests.filter((time) => time > windowStart);

    if (recentRequests.length >= this.limit) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
}

// CSRF protection
export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

// Session management
export async function validateSession(): Promise<boolean> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return !error && !!session;
}

// Secure headers
export const secureHeaders = {
  "Content-Security-Policy": `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co https://*.openai.com;
    frame-src 'self' https://accounts.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s+/g, " ")
    .trim(),
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Resource-Policy": "same-origin",
};

// Data encryption
export async function encryptData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(data)
  );
  return JSON.stringify({
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  });
}

export async function decryptData(encryptedData: string): Promise<string> {
  const { iv, data } = JSON.parse(encryptedData);
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    new Uint8Array(data)
  );
  return new TextDecoder().decode(decrypted);
}

// Request validation
export function validateRequest(
  request: Request,
  allowedMethods: string[] = ["GET", "POST", "PUT", "DELETE"]
): boolean {
  const method = request.method.toUpperCase();
  if (!allowedMethods.includes(method)) {
    return false;
  }

  const contentType = request.headers.get("content-type");
  if (method !== "GET" && contentType !== "application/json") {
    return false;
  }

  return true;
}

// API key validation
export function validateApiKey(apiKey: string): boolean {
  const apiKeyPattern = /^[a-zA-Z0-9]{32,}$/;
  return apiKeyPattern.test(apiKey);
}

// JWT validation
export async function validateJWT(token: string): Promise<boolean> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    return !error && !!user;
  } catch (error) {
    return false;
  }
}

// Secure cookie options
export const secureCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 1 week
};
