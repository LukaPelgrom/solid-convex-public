import { expect, test } from "@playwright/test";

const demoUrl = "http://localhost:3201";

test.use({ reducedMotion: "no-preference" });

const registerUser = async (page: import("@playwright/test").Page) => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  await page.goto(`${demoUrl}/register`);
  await expect(
    page.getByRole("heading", { name: "Create user" }),
  ).toBeVisible();
  await page.getByLabel("Name").fill(`Todos AutoAnimate ${suffix}`);
  await page
    .getByLabel("Email")
    .fill(`todos-autoanimate-${suffix}@example.com`);
  await page.getByLabel("Password").fill("Welcome01!");
  const createAccount = page.getByRole("button", { name: "Create account" });
  await expect(createAccount).toBeEnabled();
  await createAccount.click();
  await expect(page).toHaveURL(`${demoUrl}/todos`, { timeout: 30_000 });
};

test("todos reorder uses AutoAnimate on stable keyed rows", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 820 });
  await registerUser(page);

  await page.goto(`${demoUrl}/todos`);
  await expect(
    page.getByRole("heading", { name: "Todo CRUD playground" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Reset" }).click();
  await expect(
    page.getByText("Ship the Solid Convex Public demo"),
  ).toBeVisible();
  await expect(page.getByText("Animate list mutations")).toBeVisible();
  await expect
    .poll(() => readTodoTitles(page))
    .toEqual(["Ship the Solid Convex Public demo", "Animate list mutations"]);

  const before = await readTodoRows(page);
  expect(before.map((row) => row.title)).toEqual([
    "Ship the Solid Convex Public demo",
    "Animate list mutations",
  ]);

  await page.getByRole("button", { name: "Swap first two" }).click();

  await expect
    .poll(() => readActiveTodoAnimations(page), {
      intervals: [16, 16, 32, 32, 64, 64],
      timeout: 1_000,
    })
    .toBeGreaterThan(0);

  const duringScreenshot = await page.screenshot({
    path: testInfo.outputPath("todos-autoanimate-during-swap.png"),
  });
  expect(duringScreenshot.byteLength).toBeGreaterThan(10_000);

  await expect
    .poll(() => readTodoTitles(page))
    .toEqual(["Animate list mutations", "Ship the Solid Convex Public demo"]);

  const after = await readTodoRows(page);
  expect(after.map((row) => row.id)).toEqual([before[1].id, before[0].id]);
  expect(after[0].top).toBeLessThan(after[1].top);
});

const readTodoTitles = async (page: import("@playwright/test").Page) =>
  await page
    .getByTestId("todos-list")
    .locator(".todo-row h3")
    .evaluateAll((headings) =>
      headings.map((heading) => heading.textContent?.trim() ?? ""),
    );

const readActiveTodoAnimations = async (
  page: import("@playwright/test").Page,
) =>
  await page.getByTestId("todos-list").evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    return animations.filter(
      (animation) =>
        animation.playState === "pending" || animation.playState === "running",
    ).length;
  });

const readTodoRows = async (page: import("@playwright/test").Page) =>
  await page
    .getByTestId("todos-list")
    .locator(".todo-row")
    .evaluateAll((rows) =>
      rows.map((row) => {
        const rect = row.getBoundingClientRect();
        return {
          id: row.getAttribute("data-testid"),
          title: row.querySelector("h3")?.textContent?.trim() ?? "",
          top: rect.top,
        };
      }),
    );
