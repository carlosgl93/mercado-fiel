import { test, expect } from '@playwright/test';
import { goToEnvUrl } from '../utils/goToEnvUrl';

test('Modifies prestador comuna', async ({ page }) => {
  await page.goto(goToEnvUrl());
  await page.getByRole('link', { name: 'Ingresar' }).click();
  await page.getByLabel('Email *').click();
  await page.getByLabel('Email *').fill('prestadorwgi@gmail.com');
  await page.getByLabel('Email *').press('Tab');
  await page.getByLabel('Password *').fill('123456');
  await page.getByLabel('Password *').press('Enter');
  await page.getByRole('button', { name: 'Construir perfil' }).click();
  await page.getByRole('link', { name: 'Comunas' }).click();
  await page.getByPlaceholder('Indicanos tu comuna').click();
  await page.getByPlaceholder('Indicanos tu comuna').fill('macha');
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Indicanos tu comuna').fill('machal');
    await page
      .getByRole('listitem', {
        name: 'Machalí ',
      })
      .click();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByRole('alert')).toContainText('Comunas actualizadas');
});