import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await expect(await request.post('/api/demo/reset')).toBeOK();
});

test('an adopter can find a pet and submit an application', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Meet your new best friend' }),
  ).toBeVisible();
  await expect(page.getByText('12 pets found')).toBeVisible();

  await page.getByLabel('Species').selectOption({ label: 'Dog' });
  await page.getByLabel('Status').selectOption({ label: 'Available' });
  await page.getByLabel('Search by name').fill('pep');
  await expect(page.getByText('1 pet found')).toBeVisible();
  await expect(page).toHaveURL(/species=dog/);

  await page.getByRole('link', { name: 'Pepper' }).click();
  await expect(page).toHaveURL(/\/pets\/pet-007$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Pepper' })).toBeVisible();

  const form = page.getByRole('form', { name: 'Apply to adopt Pepper' });
  await form.getByRole('button', { name: 'Send application' }).click();
  await expect(form.getByText('Enter your full name')).toBeVisible();

  await form.getByLabel('Full name').fill('Jordan Rivera');
  await form.getByLabel('Email').fill('jordan@example.com');
  await form.getByLabel('House').check();
  await form.getByLabel('I have other pets at home').check();
  await form
    .getByLabel('Why would you be a great match?')
    .fill('We run every morning and have a big fenced yard for fetch.');
  await form.getByRole('button', { name: 'Send application' }).click();

  await expect(page.getByRole('heading', { name: 'Application received!' })).toBeFocused();
  await expect(page.getByText('app-0001')).toBeVisible();
  // The first application moves the pet to "pending".
  await expect(page.getByText('Adoption pending')).toBeVisible();
});
