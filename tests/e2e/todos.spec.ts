import { expect, test, type Page } from "@playwright/test";

const demoUrl = "http://localhost:3201";

const registerUser = async (page: Page) => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const userName = `Todo E2E User ${suffix}`;
  const email = `todo-e2e-${suffix}@example.com`;

  await page.goto(`${demoUrl}/register`);
  await expect(
    page.getByRole("heading", { name: "Create user" }),
  ).toBeVisible();

  await page.getByLabel("Name").fill(userName);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Welcome01!");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(`${demoUrl}/`);

  return { email, suffix, userName };
};

const todoRow = (page: Page, title: string) =>
  page.locator("article.todo-row", { hasText: title }).first();

const todoTitles = async (page: Page) =>
  await page.locator("article.todo-row h3").allTextContents();

const expectTodoTitles = async (page: Page, expected: string[]) => {
  await expect.poll(() => todoTitles(page)).toEqual(expected);
};

const sidebarWidth = async (page: Page) => {
  const box = await page.getByTestId("web-solid-sidebar").boundingBox();
  if (!box) {
    throw new Error("Sidebar is not visible.");
  }

  return Math.round(box.width);
};

const addTodo = async (page: Page, title: string, notes = "") => {
  await page.getByLabel("Title").first().fill(title);
  await page.getByLabel("Notes").first().fill(notes);
  await page.getByRole("button", { name: "Add todo" }).click();
};

test("TanStack todos are server-backed, auth-attributed, and synced across tabs", async ({
  browser,
}) => {
  const context = await browser.newContext();
  const pageA = await context.newPage();

  try {
    const { suffix, userName } = await registerUser(pageA);
    const pageB = await context.newPage();
    const firstTitle = `First synced todo ${suffix}`;
    const firstNotes = `First notes ${suffix}`;
    const secondTitle = `Second synced todo ${suffix}`;
    const secondNotes = `Second notes ${suffix}`;
    const updatedTitle = `Updated synced todo ${suffix}`;

    await pageA.goto(`${demoUrl}/todos`);
    await pageB.goto(`${demoUrl}/todos`);
    await expect(
      pageA.getByRole("heading", { name: "Todo CRUD playground" }),
    ).toBeVisible();
    await expect(
      pageB.getByRole("heading", { name: "Todo CRUD playground" }),
    ).toBeVisible();
    const initialSidebarWidth = await sidebarWidth(pageA);
    expect(initialSidebarWidth).toBeGreaterThan(250);
    await expect(
      pageA.getByRole("button", { name: "Toggle Sidebar" }),
    ).toHaveCount(0);

    await pageA.getByRole("button", { name: "Reset" }).click();
    await expectTodoTitles(pageB, [
      "Ship the Solid Configs Public demo",
      "Animate list mutations",
    ]);
    await expect(
      todoRow(pageB, "Ship the Solid Configs Public demo"),
    ).toContainText(`Created by ${userName}`);

    await addTodo(pageA, firstTitle, firstNotes);
    await expect(todoRow(pageB, firstTitle)).toBeVisible();
    await expect(todoRow(pageB, firstTitle)).toContainText(
      `Created by ${userName}`,
    );
    await expect(todoRow(pageB, firstTitle)).toContainText(firstNotes);

    await pageB.reload();
    await expect(todoRow(pageB, firstTitle)).toBeVisible();
    await expect(todoRow(pageB, firstTitle)).toContainText(
      `Created by ${userName}`,
    );

    await addTodo(pageA, secondTitle, secondNotes);
    await expectTodoTitles(pageB, [
      secondTitle,
      firstTitle,
      "Ship the Solid Configs Public demo",
      "Animate list mutations",
    ]);

    await pageA.getByRole("button", { name: "Move first to end" }).click();
    await expectTodoTitles(pageB, [
      firstTitle,
      "Ship the Solid Configs Public demo",
      "Animate list mutations",
      secondTitle,
    ]);

    await pageA.getByRole("button", { name: "Swap first two" }).click();
    await expectTodoTitles(pageB, [
      "Ship the Solid Configs Public demo",
      firstTitle,
      "Animate list mutations",
      secondTitle,
    ]);

    await pageA.getByRole("button", { name: "Replace first" }).click();
    await expectTodoTitles(pageB, [
      "Replacement todo",
      firstTitle,
      "Animate list mutations",
      secondTitle,
    ]);
    await expect(todoRow(pageB, "Replacement todo")).toContainText(
      `Created by ${userName}`,
    );

    await todoRow(pageA, "Replacement todo")
      .getByRole("button", { name: "Mark done" })
      .click();
    await expect(
      todoRow(pageB, "Replacement todo").getByRole("button", {
        name: "Mark open",
      }),
    ).toBeVisible();

    await todoRow(pageA, "Replacement todo")
      .getByRole("button", { name: "Edit" })
      .click();
    const editRow = pageA.locator("article.todo-row--editing").first();
    await expect(editRow).toBeVisible();
    await editRow.getByLabel("Title").fill(updatedTitle);
    await editRow.getByRole("button", { name: "Save" }).click();

    await expect(todoRow(pageB, updatedTitle)).toBeVisible();
    await expect(todoRow(pageB, updatedTitle)).toContainText(
      `Created by ${userName}`,
    );
    await expect(pageB.getByText("Replacement todo")).toHaveCount(0);

    await todoRow(pageA, updatedTitle)
      .getByRole("button", { name: "Delete" })
      .click();
    await expect(todoRow(pageB, updatedTitle)).toHaveCount(0);
    await expect.poll(() => sidebarWidth(pageA)).toBe(initialSidebarWidth);
  } finally {
    await context.close();
  }
});
