import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../pages/_app.tsx", import.meta.url), "utf8");

test("works routes cannot be hidden by the global loading layer", () => {
  assert.match(source, /const isWorksPath = \(path = \"\"\) =>/);
  assert.match(source, /path === \"\/\" \|\| path === \"\/works\"/);
  assert.match(source, /const visiblePageLoading =/);
  assert.ok(source.includes('!isWorksPath(router.asPath.split("?")[0])'));
  assert.ok(source.includes("!isWorksPath(router.pathname)"));
  assert.match(source, /<main className=\{String\(visiblePageLoading\)\}>/);
  assert.match(source, /loading \" \+ visiblePageLoading/);
});
