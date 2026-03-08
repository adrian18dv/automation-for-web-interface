import { test, expect } from '@playwright/test';

test.describe("SAGA - Apply for service", { tag: "@apply" }, async () => {

    // Muck web page
    const pageAddress = `file://${process.cwd()}/index.html`;
    const validServices = ["Adoption", "Grooming", "Dog walking"];
    const validEmail = "test-email@gmail.com";
    const validName = "John Snow";
    const dogName = "Rubby"

    const invalidEmails = ['test', 'test@', '@gmail.com', 'test@gmail', 'test@gmail.', 'test@.com'];

    validServices.forEach((service) => {
        test(`Valid request - ${service}`, async ({ page }) => {
            await page.goto(pageAddress);
            // Fill the form
            await page.locator('#applicantName').fill(validName);
            await page.locator('#applicantEmail').fill(validEmail);
            await page.locator('#serviceType').selectOption(service);
            await page.locator('#dogName').fill(dogName);

            // Submit the form
            await page.getByRole('button', { name: 'Apply now' }).click();

            // Verify success message
            await expect(page.locator('#formError')).toHaveText('✅ Application sent! (demo)');
        });
    });

    test('Apply with no name', async ({ page }) => {
        await page.goto(pageAddress);

        // Fill only email and other fields, leave name empty
        await page.locator('#applicantEmail').fill(validEmail);
        await page.locator('#serviceType').selectOption('Adoption');
        await page.locator('#dogName').fill(dogName);

        // Submit the form
        await page.getByRole('button', { name: 'Apply now' }).click();

        // Verify error message
        await expect(page.locator('#formError')).toHaveText('❌ Name is required.');
    });

    test('Apply with no email', async ({ page }) => {
        await page.goto(pageAddress);

        // Fill only name and other fields, leave email empty
        await page.locator('#applicantName').fill(validName);
        await page.locator('#serviceType').selectOption('Adoption');
        await page.locator('#dogName').fill(dogName);

        // Submit the form
        await page.getByRole('button', { name: 'Apply now' }).click();

        // Verify error message
        await expect(page.locator('#formError')).toHaveText('❌ Email is required.');
    });

    invalidEmails.forEach((invalidEmail) => {
        const safeEmail = invalidEmail.replace('@', '(at)');
        test(`Apply with invalid email - ${safeEmail}`, async ({ page }) => {
            await page.goto(pageAddress);

            // Fill form with invalid email formats
            await page.locator('#applicantName').fill(validName);
            await page.locator('#dogName').fill(dogName);
            await page.locator('#serviceType').selectOption('Adoption');

            // Test cases for invalid emails
            await page.locator('#applicantEmail').fill(invalidEmail);
            await page.getByRole('button', { name: 'Apply now' }).click();
            await expect(page.locator('#formError')).toHaveText('❌ Please enter a valid email address.');
        });
    });

});