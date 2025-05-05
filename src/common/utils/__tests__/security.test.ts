import { describe, it, expect, vi } from "vitest";
import {
  sanitizeInput,
  validatePassword,
  RateLimiter,
  generateCSRFToken,
  validateRequest,
  validateApiKey,
  validateJWT,
} from "../security";
import { supabase } from "@/common/lib/supabase";
import { User, AuthError } from "@supabase/supabase-js";

// Mock Supabase
vi.mock("@/common/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe("Security Utilities", () => {
  describe("sanitizeInput", () => {
    it("should sanitize HTML tags", () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        'alert("xss")'
      );
      expect(sanitizeInput("<div>test</div>")).toBe("test");
    });

    it("should escape special characters", () => {
      expect(sanitizeInput("&<>\"'")).toBe("&amp;&lt;&gt;&quot;&#39;");
    });
  });

  describe("validatePassword", () => {
    it("should validate strong passwords", () => {
      const result = validatePassword("StrongPass123!");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect weak passwords", () => {
      const result = validatePassword("weak");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must be at least 8 characters long"
      );
      expect(result.errors).toContain(
        "Password must contain at least one uppercase letter"
      );
      expect(result.errors).toContain(
        "Password must contain at least one number"
      );
      expect(result.errors).toContain(
        "Password must contain at least one special character"
      );
    });
  });

  describe("RateLimiter", () => {
    it("should allow requests within limit", () => {
      const limiter = new RateLimiter(2, 1000);
      expect(limiter.isAllowed("test")).toBe(true);
      expect(limiter.isAllowed("test")).toBe(true);
      expect(limiter.isAllowed("test")).toBe(false);
    });

    it("should reset after window time", async () => {
      const limiter = new RateLimiter(1, 100);
      expect(limiter.isAllowed("test")).toBe(true);
      expect(limiter.isAllowed("test")).toBe(false);
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(limiter.isAllowed("test")).toBe(true);
    });
  });

  describe("CSRF Protection", () => {
    it("should generate unique tokens", () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(token1).not.toBe(token2);
      expect(token1).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });
  });

  describe("Request Validation", () => {
    it("should validate allowed methods", () => {
      const request = new Request("http://example.com", { method: "GET" });
      expect(validateRequest(request)).toBe(true);

      const postRequest = new Request("http://example.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      expect(validateRequest(postRequest)).toBe(true);
    });

    it("should reject invalid methods", () => {
      const request = new Request("http://example.com", { method: "OPTIONS" });
      expect(validateRequest(request)).toBe(false);
    });

    it("should validate content type for non-GET requests", () => {
      const request = new Request("http://example.com", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
      });
      expect(validateRequest(request)).toBe(false);
    });
  });

  describe("API Key Validation", () => {
    it("should validate correct API keys", () => {
      expect(validateApiKey("12345678901234567890123456789012")).toBe(true);
      expect(validateApiKey("abc123def456ghi789jkl012mno345pqr")).toBe(true);
    });

    it("should reject invalid API keys", () => {
      expect(validateApiKey("short")).toBe(false);
      expect(validateApiKey("1234567890123456789012345678901")).toBe(false);
      expect(validateApiKey("12345678901234567890123456789012!")).toBe(false);
    });
  });

  describe("JWT Validation", () => {
    it("should validate valid JWT tokens", async () => {
      const mockUser: User = {
        id: "123",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
        email: "test@example.com",
        role: "authenticated",
        updated_at: new Date().toISOString(),
      };

      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        {
          data: { user: mockUser },
          error: null,
        }
      );

      const isValid = await validateJWT("valid-token");
      expect(isValid).toBe(true);
    });

    it("should reject invalid JWT tokens", async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        {
          data: { user: null },
          error: new AuthError("Invalid token", 401),
        }
      );

      const isValid = await validateJWT("invalid-token");
      expect(isValid).toBe(false);
    });
  });
});
