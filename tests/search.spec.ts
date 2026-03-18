import { test, expect } from '@playwright/test';

test.describe("SAGA - Search Database", { tag: "@search" }, async () => {
  // Path to the local HTML file (reuse the same logic as in the apply tests)
  const pageAddress = `file://${process.cwd()}/index.html`;

  // Expected dog data (hardcoded from script.js)
  const expectedDogs = [
    { name: 'Luna', breed: 'Labrador Retriever', age: 2 },
    { name: 'Charlie', breed: 'Beagle', age: 4 },
    { name: 'Bella', breed: 'Poodle', age: 1 },
    { name: 'Max', breed: 'German Shepherd', age: 5 },
    { name: 'Coco', breed: 'Golden Retriever', age: 3 },
  ];

  test('Should have an empty table before search', async ({ page }) => {
    await page.goto(pageAddress);

    // The table body should contain no rows initially
    const rows = page.locator('#tableBody tr');
    await expect(rows).toHaveCount(0);
  });

  test('Should show loading indicator when search button is clicked', async ({ page }) => {
    await page.goto(pageAddress);

    // Click the search button
    await page.click('#searchBtn');

    // Wait for the loading row to appear (class "loading" and the text)
    const loadingRow = page.locator('#tableBody tr.loading');
    await expect(loadingRow).toBeVisible();
    await expect(loadingRow).toContainText('Searching for good dogs...');
    // The spinner element should be present inside the loading row
    await expect(loadingRow.locator('.spinner')).toBeVisible();
  });

  test('Should display the correct dog data after loading finishes', async ({ page }) => {
    await page.goto(pageAddress);

    // Trigger search
    await page.click('#searchBtn');

    // Wait until the 5 data rows appear (timeout > 3s)
    const rows = page.locator('#tableBody tr');
    await expect(rows).toHaveCount(5, { timeout: 5000 });

    // Verify each row's content matches the expected data
    for (let i = 0; i < expectedDogs.length; i++) {
      const row = rows.nth(i);
      const dog = expectedDogs[i];
      await expect(row.locator('td').nth(0)).toHaveText(dog.name);
      await expect(row.locator('td').nth(1)).toHaveText(dog.breed);
      await expect(row.locator('td').nth(2)).toHaveText(dog.age.toString());
    }
  });

  test('Should show loading again if search is clicked while data is already present', async ({ page }) => {
    await page.goto(pageAddress);

    // First search to populate data
    await page.click('#searchBtn');
    await expect(page.locator('#tableBody tr')).toHaveCount(5, { timeout: 5000 });

    // Click search again
    await page.click('#searchBtn');

    // Loading indicator should reappear
    const loadingRow = page.locator('#tableBody tr.loading');
    await expect(loadingRow).toBeVisible();
    await expect(loadingRow).toContainText('Searching for good dogs...');

    // After another 3 seconds, the data should be back
    await expect(page.locator('#tableBody tr')).toHaveCount(5, { timeout: 5000 });
    // Optionally verify first row again
    await expect(page.locator('#tableBody tr').first()).toContainText('Luna');
  });
});