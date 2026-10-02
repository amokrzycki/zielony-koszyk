// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ImageCarousel from "./ImageCarousel.tsx";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

const SLIDE_MS = 6000;

describe("ImageCarousel", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.replaceChildren(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    vi.useRealTimers();
  });

  const render = async () => {
    await act(async () => root.render(<ImageCarousel />));
  };

  const section = () => {
    const el = container.querySelector('section[aria-label="Dostawa i oferta"]');
    if (!el) throw new Error("missing carousel section");
    return el;
  };

  const activeIndex = () => {
    const tabs = [...container.querySelectorAll('[role="tab"]')];
    return tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
  };

  const fire = async (type: string) => {
    await act(async () => {
      section().dispatchEvent(new FocusEvent(type, { bubbles: true }));
    });
  };

  const tick = async (ms: number) => {
    await act(async () => {
      vi.advanceTimersByTime(ms);
    });
  };

  it("advances every SLIDE_MS", async () => {
    await render();
    expect(activeIndex()).toBe(0);
    await tick(SLIDE_MS);
    expect(activeIndex()).toBe(1);
    await tick(SLIDE_MS);
    expect(activeIndex()).toBe(2);
  });

  it("pauses while focused and resumes after blur", async () => {
    await render();
    await fire("focusin");
    await tick(SLIDE_MS * 3);
    expect(activeIndex()).toBe(0);
    await fire("focusout");
    await tick(SLIDE_MS);
    expect(activeIndex()).toBe(1);
  });

  it("freezes elapsed progress while paused instead of resetting it", async () => {
    await render();
    await tick(SLIDE_MS - 1000);
    await fire("focusin");
    await tick(SLIDE_MS);
    expect(activeIndex()).toBe(0);
    await fire("focusout");
    await tick(1000);
    expect(activeIndex()).toBe(1);
  });
});
