import { expect, test, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"], browserName: "webkit", reducedMotion: "no-preference" });

const url = process.env.BASE_URL || "http://127.0.0.1:4173/";

async function craftSamples(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const craft = Array.from(document.querySelectorAll<SVGSVGElement>("#hero svg[viewBox]"))
      .filter((svg) => ["0 0 120 40", "0 0 100 48", "0 0 60 92", "0 0 64 80"].includes(svg.getAttribute("viewBox") || ""))
      .map((svg) => {
        const wrapper = svg.parentElement as HTMLElement | null;
        return {
          viewBox: svg.getAttribute("viewBox"),
          wrapperTransform: wrapper ? getComputedStyle(wrapper).transform : "",
          svgTransform: getComputedStyle(svg).transform,
          animationPlayState: getComputedStyle(svg).animationPlayState,
        };
      });
    return {
      reduceMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      craft,
    };
  });
}

async function waitForFooterClouds(page: import("@playwright/test").Page) {
  for (let attempt = 0; attempt < 36; attempt += 1) {
    const cloudCount = await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 0.85);
      return document.querySelectorAll("footer .animate-cloud-pass").length;
    });
    if (cloudCount > 0) return;
    await page.waitForTimeout(350);
  }
  throw new Error("Footer cloud animation did not mount near the viewport");
}

test("mobile hero sky craft move over time", async ({ page }) => {
  await page.goto(url);
  await expect(page.locator("#hero")).toBeVisible();

  const first = await craftSamples(page);
  await page.waitForTimeout(1200);
  const second = await craftSamples(page);

  expect(first.reduceMotion).toBe(false);
  expect(first.craft.length).toBeGreaterThan(0);
  expect(second.craft.some((sample, index) => sample.wrapperTransform !== first.craft[index]?.wrapperTransform)).toBe(true);
});

test("mobile footer landscape animations unpause near viewport", async ({ page }) => {
  await page.goto(url);
  await expect(page.locator("#hero")).toBeVisible();
  await waitForFooterClouds(page);
  await expect(page.locator("footer")).toBeVisible();
  await page.waitForTimeout(600);

  const state = await page.evaluate(() => {
    const footer = document.querySelector("footer");
    const animated = footer?.querySelector<HTMLElement>(".animate-cloud-pass, .animate-wind, .animate-glint");
    const moving = footer?.querySelector<SVGGraphicsElement>(".animate-cloud-pass");
    const firstX = moving?.getCTM()?.e ?? null;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          playState: animated ? getComputedStyle(animated).animationPlayState : null,
          firstX,
          secondX: moving?.getCTM()?.e ?? null,
        });
      }, 700);
    });
  });

  expect(state).toMatchObject({ playState: "running" });
  expect(Number(state.secondX)).toBeGreaterThan(Number(state.firstX));
});
