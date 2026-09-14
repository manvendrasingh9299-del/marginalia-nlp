import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SentimentPanel from "../components/SentimentPanel";
import { ToastProvider } from "../context/ToastContext";
import { api } from "../api";

vi.mock("../api", () => ({
  api: {
    sentiment: vi.fn(),
  },
}));

function renderWithProviders(ui) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe("SentimentPanel", () => {
  it("renders with default sample text", () => {
    renderWithProviders(<SentimentPanel />);
    expect(screen.getByText("Sentiment")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /run analysis/i })).toBeInTheDocument();
  });

  it("shows the empty state before any analysis has run", () => {
    renderWithProviders(<SentimentPanel />);
    expect(
      screen.getByText(/Run analysis to see the sentiment/i)
    ).toBeInTheDocument();
  });

  it("displays the result after a successful analysis", async () => {
    api.sentiment.mockResolvedValueOnce({ label: "POSITIVE", score: 0.987 });

    renderWithProviders(<SentimentPanel />);
    fireEvent.click(screen.getByRole("button", { name: /run analysis/i }));

    await waitFor(() => {
      expect(screen.getByText("POSITIVE")).toBeInTheDocument();
    });
    expect(screen.getByText("98.7%")).toBeInTheDocument();
  });

  it("shows an inline error when the API call fails", async () => {
    api.sentiment.mockRejectedValueOnce(new Error("Backend unreachable"));

    renderWithProviders(<SentimentPanel />);
    fireEvent.click(screen.getByRole("button", { name: /run analysis/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Backend unreachable");
    });
  });
});