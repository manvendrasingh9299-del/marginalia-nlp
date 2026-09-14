import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CopyButton from "../components/CopyButton";

describe("CopyButton", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders the default label", () => {
    render(<CopyButton text="hello world" />);
    expect(screen.getByText("copy")).toBeInTheDocument();
  });

  it("copies text to clipboard and shows confirmation on click", async () => {
    render(<CopyButton text="hello world" />);
    fireEvent.click(screen.getByText("copy"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello world");

    await waitFor(() => {
      expect(screen.getByText("copied ✓")).toBeInTheDocument();
    });
  });
});