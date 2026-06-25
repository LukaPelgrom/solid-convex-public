import { expect, test, type Page } from "@playwright/test";

const demoUrl = "http://localhost:3201";

const registerAndSignIn = async (page: Page) => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const userName = "Todo E2E User";
  const email = `e2e-todo-${suffix}@example.com`;

  await page.goto(`${demoUrl}/register`);
  await expect(
    page.getByRole("heading", { name: "Create user" }),
  ).toBeVisible();

  await page.getByLabel("Name").fill(userName);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Welcome01!");
  const createAccount = page.getByRole("button", { name: "Create account" });
  await expect(createAccount).toBeEnabled();
  await createAccount.click();

  await expect(page).toHaveURL(`${demoUrl}/todos`, { timeout: 30_000 });
  await expect(
    page.getByRole("heading", { name: "Todo CRUD playground" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Welcome01!");
  const signIn = page.getByRole("button", { name: "Sign in" });
  await expect(signIn).toBeEnabled();
  await signIn.click();

  await expect(
    page.getByRole("heading", { name: "Todo CRUD playground" }),
  ).toBeVisible();

  return { suffix };
};

test("protected todos route redirects unauthenticated users to sign in", async ({
  page,
}) => {
  await page.goto(`${demoUrl}/todos`);

  await expect(page).toHaveURL(`${demoUrl}/?redirect=%2Ftodos`);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(page.getByText("Need a new user?")).toBeVisible();
  await expect(page.getByRole("link", { name: "Create one" })).toBeVisible();
});

test("user can register, sign in, and create a todo", async ({ page }) => {
  const { suffix } = await registerAndSignIn(page);
  const title = `E2E todo ${suffix}`;

  await page.getByLabel("Title").fill(title);
  await page.getByRole("button", { name: "Add todo" }).click();

  await expect(page.getByText(title)).toBeVisible();
  await expect(
    page.getByTestId("web-solid-sidebar").getByRole("link", { name: "Todos" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Board" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Admin" })).toHaveCount(0);
});
