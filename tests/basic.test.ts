import { expect, it } from "vitest";

it("test-js-basic", () => {
  expect(null).toBeFalsy();
  expect(undefined).toBeFalsy();
  expect(0).toBeFalsy();
  expect("").toBeFalsy();
  expect({}).not.toBeFalsy();
  expect([]).not.toBeFalsy();

  const a = { 1: "test1" };
  const b = Object.assign({}, a, { "1": "test2" });

  expect(a[1]).toBe("test1");
  expect(a["1"]).toBe("test1");
  expect(b[1]).toBe("test2");
  expect(b["1"]).toBe("test2");
  expect(Object.hasOwn(a, 1)).toBe(true);
  expect(Object.hasOwn(a, "1")).toBe(true);
});
