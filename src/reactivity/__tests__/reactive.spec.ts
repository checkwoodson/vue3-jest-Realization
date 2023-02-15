import { reactive } from "../reactivity";
/**
 * 1. reactive和源数据是不相同的
 * 2. reactive和源数据的value相同
 */
describe("reactive", () => {
  it("reactive path", () => {
    const origin = { age: 10 };
    const observer = reactive(origin);
    expect(origin).not.toBe(observer);
    expect(origin.age).toBe(observer.age);
  });
});
