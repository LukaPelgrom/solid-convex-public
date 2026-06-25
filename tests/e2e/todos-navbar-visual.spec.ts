import { expect, test } from "@playwright/test";

const demoUrl = "http://localhost:3201";

const registerUser = async (page: import("@playwright/test").Page) => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  await page.goto(`${demoUrl}/register`);
  await expect(
    page.getByRole("heading", { name: "Create user" }),
  ).toBeVisible();
  await page.getByLabel("Name").fill(`Todos Navbar Visual ${suffix}`);
  await page
    .getByLabel("Email")
    .fill(`todos-navbar-visual-${suffix}@example.com`);
  await page.getByLabel("Password").fill("Welcome01!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(`${demoUrl}/`);
};

test("todos shell keeps navigation inside the viewport while content scrolls", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 520 });
  await registerUser(page);

  await page.goto(`${demoUrl}/todos`);
  await expect(
    page.getByRole("heading", { name: "Todo CRUD playground" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(
    page.getByText("Ship the Solid Configs Public demo"),
  ).toBeVisible();
  await expect(page.getByTestId("web-solid-sidebar")).toBeVisible();
  await expect(page.getByTestId("web-solid-sidebar-user")).toBeVisible();

  const beforeScroll = await readShellMetrics(page);
  expect(beforeScroll.sidebar.bottom).toBeLessThanOrEqual(
    beforeScroll.viewportHeight + 1,
  );
  expect(beforeScroll.sidebarUser.bottom).toBeLessThanOrEqual(
    beforeScroll.viewportHeight + 1,
  );
  expect(beforeScroll.mainScroll.scrollHeight).toBeGreaterThan(
    beforeScroll.mainScroll.clientHeight,
  );
  expect(beforeScroll.windowScrollY).toBe(0);

  await page.getByTestId("web-solid-main-scroll").evaluate((element) => {
    element.scrollTop = 480;
  });

  const afterScroll = await readShellMetrics(page);
  expect(afterScroll.mainScroll.scrollTop).toBeGreaterThan(0);
  expect(afterScroll.windowScrollY).toBe(0);
  expect(afterScroll.sidebar.top).toBe(0);
  expect(afterScroll.sidebar.bottom).toBeLessThanOrEqual(
    afterScroll.viewportHeight + 1,
  );
  expect(afterScroll.sidebarUser.bottom).toBeLessThanOrEqual(
    afterScroll.viewportHeight + 1,
  );

  const screenshot = await page.screenshot({
    path: testInfo.outputPath("todos-navbar-fixed.png"),
  });
  expect(screenshot.byteLength).toBeGreaterThan(10_000);
});

const readShellMetrics = async (page: import("@playwright/test").Page) =>
  await page.evaluate(() => {
    const rectFor = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Missing element: ${selector}`);
      }

      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        clientHeight: element.clientHeight,
        height: rect.height,
        scrollHeight: element.scrollHeight,
        scrollTop: element.scrollTop,
        top: rect.top,
      };
    };

    return {
      mainScroll: rectFor('[data-testid="web-solid-main-scroll"]'),
      sidebar: rectFor('[data-testid="web-solid-sidebar"]'),
      sidebarUser: rectFor('[data-testid="web-solid-sidebar-user"]'),
      viewportHeight: window.innerHeight,
      windowScrollY: window.scrollY,
    };
  });
