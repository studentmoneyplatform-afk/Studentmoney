import { describe, expect, it } from "vitest";
import { isNigerianPhone, normalisePhone } from "@/lib/phone";

/** This rule decides who can join and whose number a reward is attributed to. */
describe("normalisePhone", () => {
  it("drops the spaces and dashes people actually type", () => {
    expect(normalisePhone("0801 234 5678")).toBe("08012345678");
    expect(normalisePhone("0801-234-5678")).toBe("08012345678");
    expect(normalisePhone(" +234 801 234 5678 ")).toBe("+2348012345678");
  });
});

describe("isNigerianPhone", () => {
  it.each(["08012345678", "07012345678", "09012345678", "+2348012345678", "2348012345678", "0801 234 5678"])(
    "accepts %s",
    (n) => expect(isNigerianPhone(n)).toBe(true),
  );

  it("rejects an unused mobile prefix", () => {
    expect(isNigerianPhone("06012345678")).toBe(false);
  });
  it("rejects a number that is too short or too long", () => {
    expect(isNigerianPhone("0801234567")).toBe(false);
    expect(isNigerianPhone("080123456789")).toBe(false);
  });
  it("rejects letters and empty input", () => {
    expect(isNigerianPhone("not a number")).toBe(false);
    expect(isNigerianPhone("")).toBe(false);
  });
  it("rejects another country's number", () => {
    expect(isNigerianPhone("+447700900123")).toBe(false);
  });
});
