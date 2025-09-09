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

  // Edit the API URL and parameters as needed
  const response = await fetch('https://fakerapi.it/api/v2/custom?_quantity=1&FirstName=firstName&LastName=lastName&Email=email');
  
  // Edit the parsing logic based on the actual API response structure
  const result = (await response.json()) as { data: Array<{ FirstName: string; LastName: string; Email: string }> };
  const user = result.data[0];

  // Edit the fake data structure based on the API response
  fakeData = {
    firstName: user.FirstName,
    lastName: user.LastName,
    email: user.Email,
  };

  // Example use of Fake Data
  //  await page.getByRole('textbox', { name: 'First Name' }).fill(fakeData.firstName);


  // Navigate to the application URL
  await page.goto(config.appUrl); 

  // Start of test

  await page.getByText('AddSpecificResource_16Contacts').click();
  await page.getByRole('menuitem', { name: 'New', exact: true }).click();
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill(fakeData.firstName);
  await page.locator('[id="id-1fed44d1-ae68-4a41-bd2b-f13acac4acfa-3-fullname_compositionLinkControl_lastname4273edbd-ac1d-40d3-9fb2-095c621b552d-fullname_compositionLinkControl_lastname.fieldControl-pcf-container-id"] span').click();
  await page.getByRole('textbox', { name: 'Last Name' }).fill(fakeData.lastName);
  await page.getByRole('textbox', { name: 'Email', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(fakeData.email);
  await page.getByRole('menuitem', { name: 'Save & Close' }).click();

  // End of test

  // Optional: Wait for save confirmation or navigation away from form
  await page.waitForTimeout(10000); // Give time for save operation to complete
});