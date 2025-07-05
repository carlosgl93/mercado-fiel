import { test, expect } from '@playwright/test';
import { goToEnvUrl } from '../utils/goToEnvUrl';

test('test', async ({ page }) => {
  await page.goto(goToEnvUrl());
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByLabel('Email *').click();
  await page.getByLabel('Email *').fill('prestador@gmail.com');
  await page.getByLabel('Email *').press('Tab');
  await page.getByLabel('Password *').fill('123456');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('alert')).toContainText('Sesión iniciada exitosamente');
});