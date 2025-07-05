import { test, expect } from '@playwright/test';
import { goToEnvUrl } from '../utils/goToEnvUrl';

test.describe('Home Screen', () => {
  test('Should render the comunas input', async ({ page }) => {
    // testing for the comunas input
    await page.goto(goToEnvUrl());
    await page.getByPlaceholder('Indicanos tu comuna').click();
    await page.getByPlaceholder('Indicanos tu comuna').fill('Provi');
    await page.getByPlaceholder('Indicanos tu comuna').press('Enter');
    await expect(page.getByText('Buscar Prestadores')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Providencia' })).toBeVisible();
  });
});
