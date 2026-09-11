import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const carouselStyles = await readFile(
  new URL("../styles/components/carousel.module.scss", import.meta.url),
  "utf8",
);

test("work carousel preserves each image's intrinsic aspect ratio", () => {
  assert.match(carouselStyles, /object-fit:\s*contain/);
  assert.match(carouselStyles, /object-position:\s*center/);
});