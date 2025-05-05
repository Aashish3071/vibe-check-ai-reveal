import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test-utils";
import { Auth } from "../Auth";
import { supabase } from "@/common/lib/supabase";

describe("Auth", () => {
  it("renders login form by default", () => {
    render(<Auth />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("switches to signup form when clicking signup tab", async () => {
    render(<Auth />);
    await userEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  it("handles login form submission", async () => {
    const mockSignIn = vi
      .fn()
      .mockResolvedValue({ data: { user: {} }, error: null });
    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(mockSignIn);

    render(<Auth />);
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByText("Sign In"));

    expect(mockSignIn).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("handles signup form submission", async () => {
    const mockSignUp = vi
      .fn()
      .mockResolvedValue({ data: { user: {} }, error: null });
    vi.mocked(supabase.auth.signUp).mockImplementation(mockSignUp);

    render(<Auth />);
    await userEvent.click(screen.getByText("Sign Up"));
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      "password123"
    );
    await userEvent.click(screen.getByText("Create Account"));

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});
