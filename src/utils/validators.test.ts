import { assert, assertEquals } from "assert";

Deno.test("assert works correctly", () => {
    assert(true);
    assertEquals(1, 1);
  });