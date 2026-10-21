import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import worker from "./index.ts";

const DELIVERED_MEDIA: Record<string, readonly [number, number]> = {
  "product:product-hero": [1000, 1000],
  "card:campaign-gaming": [900, 700],
  "card:campaign-studio": [900, 700],
  "card:campaign-party": [900, 700],
  "card:campaign-beach": [900, 700],
  "card:campaign-streamer": [900, 700],
  "card:campaign-esports": [900, 700],
  "card:product-angle": [900, 700],
  "card:product-comfort": [900, 700],
  "card:product-controls": [900, 700]
};

type ImgTag = { src: string; width: string | undefined; height: string | undefined };

const attr = (tag: string, name: string): string | undefined => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match?.[1];
};

const homepageImages = (html: string): ImgTag[] =>
  [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => {
    const tag = match[0];
    const src = (attr(tag, "src") ?? "").replaceAll("&amp;", "&");
    return { src, width: attr(tag, "width"), height: attr(tag, "height") };
  });

const jpegSize = (data: Buffer): [number, number] => {
  assert.equal(data[0], 0xff);
  assert.equal(data[1], 0xd8);
  let i = 2;
  while (i < data.length - 8) {
    if (data[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = data[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return [data.readUInt16BE(i + 7), data.readUInt16BE(i + 5)];
    }
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    i += 2 + data.readUInt16BE(i + 2);
  }
  throw new Error("JPEG size not found");
};

const intrinsicSize = (src: string): [number, number] => {
  if (src.startsWith("/assets/")) {
    const file = new URL(`../public${src}`, import.meta.url);
    return jpegSize(readFileSync(file));
  }
  const url = new URL(src, "https://hcgamerlife.org");
  const key = `${url.searchParams.get("variant")}:${url.searchParams.get("key")}`;
  const size = DELIVERED_MEDIA[key];
  assert.ok(size, `no measured size for ${src}`);
  return size;
};

describe("homepage images", () => {
  it("sets width and height to each image's intrinsic size", async () => {
    const response = await worker.fetch(new Request("https://hcgamerlife.org/"), {
      ASSETS: { fetch: async () => new Response(null, { status: 404 }) }
    });
    assert.equal(response.status, 200);
    const images = homepageImages(await response.text());
    const missing = images.filter((image) => !image.width || !image.height);
    assert.equal(images.length, 25);
    assert.deepEqual(missing, []);
    for (const image of images) {
      const [width, height] = intrinsicSize(image.src);
      assert.equal(image.width, String(width), image.src);
      assert.equal(image.height, String(height), image.src);
    }
  });
});
