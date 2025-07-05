import { test, expect } from '@playwright/test';
import { goToEnvUrl } from '../utils/goToEnvUrl';
import { generateRandomString } from 'tests/utils/generateRandomString';

test('Creates a new user', async ({ page }) => {
  await page.goto(goToEnvUrl());
  await page.getByRole('list').getByRole('link', { name: 'Comenzar' }).click();
  await page.getByRole('link', { name: 'Recibir apoyo' }).click();
  await page.getByRole('link', { name: 'Para mí' }).click();
  await page.getByPlaceholder('Indicanos tu comuna').click();
  await page.getByPlaceholder('Indicanos tu comuna').fill('Provi');
  await page.waitForTimeout(1000);
  await page.getByPlaceholder('Indicanos tu comuna').fill('dencia');
  await page.getByRole('listitem', {
    name: 'Providencia',
  }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.getByRole('button', { name: 'Soporte Terapéutico' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.getByRole('button', { name: 'Kinesiología' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.getByPlaceholder('Nombre (*)').click();
  await page.getByPlaceholder('Ingresa tu nombre').fill('usuario');
  await page.getByPlaceholder('Ingresa tu nombre').press('Tab');
  await page.getByPlaceholder('Apellido (*)').fill('apellido usuario');
  await page.getByPlaceholder('Apellido (*)').press('Tab');
  await page.getByPlaceholder('Rut Paciente (*)').fill('18445810-1');
  await page.getByPlaceholder('Rut Paciente (*)').press('Tab');
  await page.getByPlaceholder('Correo electrónico (*)').fill(`usuario${generateRandomString(3)}@gmail.com`);
  await page.getByPlaceholder('Correo electrónico (*)').press('Tab');
  await page.getByPlaceholder('Crea una contraseña (*)').fill('123456');
  await page.getByPlaceholder('Crea una contraseña (*)').press('Tab');
  await page.getByPlaceholder('Confirma tu contraseña (*)').fill('123456');
  await page.getByPlaceholder('Confirma tu contraseña (*)').press('Tab');
  await page.getByRole('checkbox', { name: 'acceptedTerms' }).check();
  await page.getByRole('button', { name: 'Siguiente' }).press('Enter');
  await page.waitForTimeout(10000);
  await expect(page.locator('#root')).toContainText('Actualizar perfil');
});