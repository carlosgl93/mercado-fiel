import { test, expect } from '@playwright/test';
import { goToEnvUrl } from '../utils/goToEnvUrl';

test('Creates new prestador experience', async ({ page }) => {
  await page.goto(goToEnvUrl());
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByLabel('Email *').click();
  await page.getByLabel('Email *').fill('prestadorwgi@gmail.com');
  await page.getByLabel('Email *').press('Tab');
  await page.getByLabel('Password *').fill('123456');
  await page.getByLabel('Password *').press('Enter');
  await page.getByRole('button', { name: 'Construir perfil' }).click();
  await page.getByRole('link', { name: 'Experiencia' }).click();
  await page.getByText('Adultos mayores').click()
  await page.getByRole('button', { name: 'Adultos mayores' }).click();
  await page.getByLabel('Personal').check();
  await page.getByLabel('Profesional').check();
  await page.getByLabel('Demencia senil').first().check();
  await page.getByText('Parkinson').nth(1).click();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByRole('alert')).toContainText('Experiencia guardada');
});