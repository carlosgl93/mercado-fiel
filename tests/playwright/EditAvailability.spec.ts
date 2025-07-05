import { test, expect } from '@playwright/test';
import { goToEnvUrl } from '../utils/goToEnvUrl';

test('test', async ({ page }) => {
  await page.goto(goToEnvUrl());
  await page.locator('li').filter({ hasText: 'Ingresar' }).click();
  await page.getByLabel('Email *').click();
  await page.getByLabel('Email *').fill('prestadorwgi@gmail.com');
  await page.getByLabel('Email *').press('Tab');
  await page.getByLabel('Password *').fill('123456');
  await page.getByLabel('Password *').press('Enter');
  await page.getByRole('button', { name: 'Construir perfil' }).click();
  await page.getByRole('link', { name: 'Disponibilidad' }).click();
  await page.getByRole('button', { name: 'Editar' }).click();
  await page.locator('div').filter({ hasText: /^Martes$/ }).getByRole('checkbox').uncheck();
  await page.locator('div').filter({ hasText: /^Jueves$/ }).getByRole('checkbox').uncheck();
  await page.locator('div').filter({ hasText: /^Viernes$/ }).getByRole('checkbox').uncheck();
  await page.locator('.PrivateSwitchBase-input').first().check();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByRole('alert')).toContainText('Disponibilidad guardada exitosamente');
});