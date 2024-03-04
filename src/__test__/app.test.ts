import { prueba } from "../shared/utils";

describe("test app", () => {
  test("test", () => {
    expect(prueba(1, 2)).toBe(3);
  });
});
