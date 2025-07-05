import { test, expect } from '@playwright/test';
import { goToEnvUrl } from '../utils/goToEnvUrl';

test('test', async ({ page }) => {
  await page.goto(goToEnvUrl());
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByLabel('Email *').click();
  await page.getByLabel('Email *').fill('prestador@gmail.com');
  await page.getByLabel('Email *').press('Tab');
  await page.getByLabel('Password *').fill('123456');
  await page.getByLabel('Password *').press('Enter');
  await page.getByRole('button', { name: 'Construir perfil' }).click();
  await page.getByRole('link', { name: 'Detalles basicos' }).click();
  await page.getByLabel('Nombre').click();
  await page.getByLabel('Género').click();
  await page.getByRole('option', { name: 'Masculino' }).click();
  await page.getByLabel('Fecha de Nacimiento').fill('1993-06-08');
  await page.getByLabel('Teléfono').click();
  await page.getByLabel('Teléfono').fill('92421413');
  await page.getByLabel('Teléfono').press('Tab');
  await page.getByLabel('Dirección').fill('Copihue 1884');
  await page.getByLabel('Dirección').press('Tab');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByRole('alert')).toContainText('Perfil actualizado correctamente');
});