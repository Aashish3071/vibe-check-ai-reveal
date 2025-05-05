import { render as rtlRender } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/common/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { vi } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock window and document objects for tests
const mockWindow = {
  history: {
    pushState: vi.fn(),
  },
  document: {
    createElement: vi.fn(),
    getElementById: vi.fn(),
    querySelector: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
};

// @ts-expect-error - Mocking window and document objects for tests
global.window = mockWindow;
// @ts-expect-error - Mocking window and document objects for tests
global.document = mockWindow.document;

export function render(ui: React.ReactElement, { route = "/" } = {}) {
  window.history.pushState({}, "Test page", route);

  return rtlRender(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          {ui}
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
