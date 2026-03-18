import { test, expect, Dialog } from '@playwright/test';

test.describe("SAGA - Create a profile", { tag: "@profile" }, async () => {
  const pageAddress = `file://${process.cwd()}/index.html`;

  const validOwner = "Arya Stark";
  const validDog = "Nymeria";
  const validBreed = "Direwolf";

  test('should create a profile card with all fields filled', async ({ page }) => {
    await page.goto(pageAddress);

    await page.locator('#ownerName').fill(validOwner);
    await page.locator('#dogNameProfile').fill(validDog);
    await page.locator('#dogBreed').fill(validBreed);
    await page.getByRole('button', { name: 'Create profile card' }).click();

    const profileCards = page.locator('.profile-card');
    await expect(profileCards).toHaveCount(1);

    const card = profileCards.first();
    await expect(card).toContainText(validDog);
    await expect(card).toContainText(validBreed);
    await expect(card).toContainText(`Owner: ${validOwner}`);
  });

  test('should create a profile card without breed (defaults to "unknown breed")', async ({ page }) => {
    await page.goto(pageAddress);

    await page.locator('#ownerName').fill(validOwner);
    await page.locator('#dogNameProfile').fill(validDog);
    // breed left empty
    await page.getByRole('button', { name: 'Create profile card' }).click();

    const profileCards = page.locator('.profile-card');
    await expect(profileCards).toHaveCount(1);

    const card = profileCards.first();
    await expect(card).toContainText(validDog);
    await expect(card).toContainText('unknown breed');
    await expect(card).toContainText(`Owner: ${validOwner}`);
  });

  test('should show alert when owner name is missing', async ({ page }) => {
    await page.goto(pageAddress);

    await page.locator('#dogNameProfile').fill(validDog);
    await page.locator('#dogBreed').fill(validBreed);

    // Race between dialog and navigation (in case form submits)
    const dialogPromise = page.waitForEvent('dialog');
    const navigationPromise = page.waitForEvent('framenavigated').catch(() => {});

    await page.getByRole('button', { name: 'Create profile card' }).click();

    const result = await Promise.race([dialogPromise, navigationPromise.then(() => 'navigation')]);

    if (result === 'navigation') {
      throw new Error('Form submitted instead of showing alert – check if preventDefault() is working');
    }

    const dialog = result as Dialog;
    expect(dialog.message()).toBe('Please fill in both owner and dog name.');
    await dialog.accept();

    await expect(page.locator('.profile-card')).toHaveCount(0);
  });

  test('should show alert when dog name is missing', async ({ page }) => {
    await page.goto(pageAddress);

    await page.locator('#ownerName').fill(validOwner);
    await page.locator('#dogBreed').fill(validBreed);

    const dialogPromise = page.waitForEvent('dialog');
    const navigationPromise = page.waitForEvent('framenavigated').catch(() => {});

    await page.getByRole('button', { name: 'Create profile card' }).click();

    const result = await Promise.race([dialogPromise, navigationPromise.then(() => 'navigation')]);

    if (result === 'navigation') {
      throw new Error('Form submitted instead of showing alert – check if preventDefault() is working');
    }

    const dialog = result as Dialog;
    expect(dialog.message()).toBe('Please fill in both owner and dog name.');
    await dialog.accept();

    await expect(page.locator('.profile-card')).toHaveCount(0);
  });

  test('should show alert when both owner and dog name are missing', async ({ page }) => {
    await page.goto(pageAddress);

    await page.locator('#dogBreed').fill(validBreed);

    const dialogPromise = page.waitForEvent('dialog');
    const navigationPromise = page.waitForEvent('framenavigated').catch(() => {});

    await page.getByRole('button', { name: 'Create profile card' }).click();

    const result = await Promise.race([dialogPromise, navigationPromise.then(() => 'navigation')]);

    if (result === 'navigation') {
      throw new Error('Form submitted instead of showing alert – check if preventDefault() is working');
    }

    const dialog = result as Dialog;
    expect(dialog.message()).toBe('Please fill in both owner and dog name.');
    await dialog.accept();

    await expect(page.locator('.profile-card')).toHaveCount(0);
  });

  test('should accumulate multiple profile cards', async ({ page }) => {
    await page.goto(pageAddress);

    // First profile
    await page.locator('#ownerName').fill('Owner One');
    await page.locator('#dogNameProfile').fill('Dog One');
    await page.locator('#dogBreed').fill('Breed One');
    await page.getByRole('button', { name: 'Create profile card' }).click();

    // Second profile
    await page.locator('#ownerName').fill('Owner Two');
    await page.locator('#dogNameProfile').fill('Dog Two');
    await page.locator('#dogBreed').fill('Breed Two');
    await page.getByRole('button', { name: 'Create profile card' }).click();

    // Third profile (no breed)
    await page.locator('#ownerName').fill('Owner Three');
    await page.locator('#dogNameProfile').fill('Dog Three');
    await page.locator('#dogBreed').fill('');
    await page.getByRole('button', { name: 'Create profile card' }).click();

    const profileCards = page.locator('.profile-card');
    await expect(profileCards).toHaveCount(3);

    await expect(profileCards.nth(0)).toContainText('Dog One');
    await expect(profileCards.nth(0)).toContainText('Owner: Owner One');
    await expect(profileCards.nth(2)).toContainText('Dog Three');
    await expect(profileCards.nth(2)).toContainText('unknown breed');
  });

  test('should reset form after successful profile creation', async ({ page }) => {
    await page.goto(pageAddress);

    await page.locator('#ownerName').fill(validOwner);
    await page.locator('#dogNameProfile').fill(validDog);
    await page.locator('#dogBreed').fill(validBreed);
    await page.getByRole('button', { name: 'Create profile card' }).click();

    await expect(page.locator('#ownerName')).toBeEmpty();
    await expect(page.locator('#dogNameProfile')).toBeEmpty();
    await expect(page.locator('#dogBreed')).toBeEmpty();

    await expect(page.locator('.profile-card')).toHaveCount(1);
  });
});