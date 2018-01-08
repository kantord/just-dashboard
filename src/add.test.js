const assert = require("assert");
const add = require("./add");

describe("Demo", () => {
  it("should add correctly", () => {
    assert.equal(add(1, 1), 2);
  });
  it("should add correctly 2", () => {
    assert.equal(add(5, -1), 4);
  });
});
