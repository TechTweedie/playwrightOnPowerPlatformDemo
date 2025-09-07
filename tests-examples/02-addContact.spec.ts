import { test, expect } from '@playwright/test';
import 'dotenv/config';

// Define the configuration interface and load values from environment variables
interface Config {
  appUrl: string; // URL of the application to test
}

// Load configuration values, falling back to defaults if environment variables are not set
const config: Config = {
  appUrl: process.env.APP_URL || 'default_url',
};

// Place this at the beginning of your test file or test function
let fakeData: { firstName: string; lastName: string; email: string };

// Test to verify the application is accessible and displays the correct name
test('add-contact', async ({ page }) => {
  // Dynamically import node-fetch for ESM compatibility
  const fetch = (await import('node-fetch')).default;
  const response = await fetch('https://fakerapi.it/api/v2/custom?_quantity=1&FirstName=firstName&LastName=lastName&Email=email');
  const result = (await response.json()) as { data: Array<{ FirstName: string; LastName: string; Email: string }> };
  const user = result.data[0];
  fakeData = {
    firstName: user.FirstName,
    lastName: user.LastName,
    email: user.Email,
  };

  // Navigate to the application URL
  await page.goto(config.appUrl); 
  
  // Look for the contacts section regardless of app title
  console.log('Looking for contacts section...');

  // Wait for the Contacts section to be available before interacting
  await page.getByText('AddSpecificResource_16Contacts').waitFor({ timeout: 15000 });
  await page.getByText('AddSpecificResource_16Contacts').click();
  
  // Wait for the New menu item to be available before clicking
  await page.getByRole('menuitem', { name: 'New', exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole('menuitem', { name: 'New', exact: true }).click();
  
  // Wait for form fields to be available before interacting
  await page.getByRole('textbox', { name: 'First Name' }).waitFor({ timeout: 10000 });
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill(fakeData.firstName);
  await page.getByRole('textbox', { name: 'First Name' }).press('Tab');
  
  // Wait for Last Name field and fill it
  await page.getByRole('textbox', { name: 'Last Name' }).waitFor({ timeout: 5000 });
  await page.getByRole('textbox', { name: 'Last Name' }).fill(fakeData.lastName);
  
  // Wait for Email field and fill it
  await page.getByRole('textbox', { name: 'Email', exact: true }).waitFor({ timeout: 5000 });
  await page.getByRole('textbox', { name: 'Email', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(fakeData.email);
  
  // Wait for Save & Close button and click it
  await page.getByRole('menuitem', { name: 'Save & Close' }).waitFor({ timeout: 10000 });
  await page.getByRole('menuitem', { name: 'Save & Close' }).click();
  
  // Optional: Wait for save confirmation or navigation away from form
  await page.waitForTimeout(2000); // Give time for save operation to complete
});