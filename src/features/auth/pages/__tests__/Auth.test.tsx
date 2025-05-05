import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "../Auth";
import { supabase } from "@/common/lib/supabase";
import { AuthResponse } from "@supabase/supabase-js";

// Mock Supabase
vi.mock("@/common/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

describe("Auth", () => {
  it("renders login form by default", () => {
    render(<Auth />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("switches to signup form when clicking signup tab", () => {
    render(<Auth />);
    fireEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("handles login form submission", async () => {
    const mockSignIn = vi
      .fn()
      .mockResolvedValue({ data: { user: {} }, error: null });
    (
      supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>
    ).mockImplementation(mockSignIn);

    render(<Auth />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("handles signup form submission", async () => {
    const mockSignUp = vi
      .fn()
      .mockResolvedValue({ data: { user: {} }, error: null });
    (supabase.auth.signUp as ReturnType<typeof vi.fn>).mockImplementation(
      mockSignUp
    );

    render(<Auth />);
    fireEvent.click(screen.getByText("Sign Up"));

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
