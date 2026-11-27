import { describe, expect, it } from "vitest";
import { toWaNumber, waLink, WA } from "@/lib/whatsapp";

describe("toWaNumber", () => {
  it("converts the local form to the international one", () => {
    expect(toWaNumber("08012345678")).toBe("2348012345678");
  });
  it("accepts a number already in international form", () => {
    expect(toWaNumber("2348012345678")).toBe("2348012345678");
    expect(toWaNumber("+234 801 234 5678")).toBe("2348012345678");
  });
  it("assumes Nigeria for a bare ten digits", () => {
    expect(toWaNumber("8012345678")).toBe("2348012345678");
  });
  it("refuses anything the wrong length rather than guessing", () => {
    expect(toWaNumber("0801")).toBeNull();
    expect(toWaNumber("234801")).toBeNull();
    expect(toWaNumber("")).toBeNull();
  });
});

describe("waLink", () => {
  it("points at the configured owner and carries the message", () => {
    const link = waLink("hello there");
    expect(link).toContain("https://wa.me/");
    expect(link).toContain("hello%20there");
  });
  it("escapes characters that would otherwise break the query", () => {
    expect(waLink("a&b=c")).toContain("a%26b%3Dc");
  });
});

describe("WA messages", () => {
  it("names the person when we know them, and reads cleanly when we do not", () => {
    expect(WA.confirmSignup("Ada")).toContain("as Ada");
    expect(WA.confirmSignup()).not.toContain("undefined");
    expect(WA.confirmSignup(null)).not.toContain("null");
  });
  it("carries the code and opportunity so the owner need not ask", () => {
    const m = WA.referralApproved("ABC123", "Tobi Music Academy");
    expect(m).toContain("ABC123");
    expect(m).toContain("Tobi Music Academy");
  });
  it("states the amount on a released reward", () => {
    expect(WA.rewardReleased("ABC123", "Tobi Music Academy", "$35")).toContain("$35");
  });
});
