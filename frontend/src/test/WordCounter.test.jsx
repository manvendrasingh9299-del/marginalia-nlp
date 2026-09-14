import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WordCounter from "../components/WordCounter";

describe("WordCounter", () => {
  it("shows zero words and characters for empty text", () => {
    render(<WordCounter text="" />);
    expect(screen.getByText(/0 words · 0 chars/)).toBeInTheDocument();
  });

  it("counts words and characters correctly", () => {
    render(<WordCounter text="hello world" />);
    expect(screen.getByText(/2 words · 11 chars/)).toBeInTheDocument();
  });

  it("applies the warning class when below the minimum word count", () => {
    const { container } = render(<WordCounter text="too short" minWords={15} />);
    expect(container.firstChild).toHaveClass("word-counter-warn");
  });

  it("does not apply the warning class when the minimum is met", () => {
    const text = new Array(20).fill("word").join(" ");
    const { container } = render(<WordCounter text={text} minWords={15} />);
    expect(container.firstChild).not.toHaveClass("word-counter-warn");
  });
});