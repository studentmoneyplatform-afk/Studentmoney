import { describe, expect, it } from "vitest";
import { formatNgn, formatUsd, formatPercent, NGN_PER_USD } from "@/lib/money";

const digits = (s: string) => s.replace(/\D/g, "");

describe("formatUsd", () => {
  it("drops a meaningless .00", () => {
    expect(formatUsd(25)).toBe("$25");
  });
  it("keeps real cents", () => {
    expect(formatUsd(17.5)).toBe("$17.50");
  });
  it("handles zero", () => {
    expect(formatUsd(0)).toBe("$0");
  });
});

describe("formatNgn", () => {
  it("converts at the configured rate, to whole naira", () => {
    // asserted against the rate rather than a literal, so setting a real
    // rate does not turn this into a false failure
    expect(digits(formatNgn(25))).toBe(String(Math.round(25 * NGN_PER_USD)));
  });
  it("shows zero as zero", () => {
    expect(digits(formatNgn(0))).toBe("0");
  });
  it("uses a sane rate — a wrong one misquotes every reward on the site", () => {
    expect(NGN_PER_USD).toBeGreaterThan(100);
    expect(NGN_PER_USD).toBeLessThan(100000);
    expect(Number.isFinite(NGN_PER_USD)).toBe(true);
  });
});

describe("formatPercent", () => {
  it("rounds a fraction to whole percent", () => {
    expect(formatPercent(0.5)).toBe("50%");
    expect(formatPercent(0.333)).toBe("33%");
    expect(formatPercent(1)).toBe("100%");
  });
});
