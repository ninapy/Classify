import { expect, test } from "@playwright/test";
import { clearUser } from "../../src/utils/api";
import { setupClerkTestingToken, clerk } from "@clerk/testing/playwright";

let map;

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */


// this "test" runs before each of the tests below ensuring the users are signed in
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('lyra@example.com');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Password', { exact: true }).fill('ckaskandeti123');
    await page.getByRole('button', { name: 'Continue' }).click();
   
});

// tests that buttons show up to interact with pins 
test('buttons that interact with pins show up', async ({ page }) => {

  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();

  const dropPinButton = await page.getByLabel("dropPinButton");
  await expect(dropPinButton).toBeVisible();
  
  const deleteAllPinsButton = await page.getByLabel("deletePinButton");
  await expect(deleteAllPinsButton).toBeVisible();
 });
 

// tests that once you drop pins and reload the page, the same pins are still there
test('pins persist on page reload', async ({ page }) => {

  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 256,
      y: 193
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 419,
      y: 104
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 536,
      y: 236
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 775,
      y: 133
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 509,
      y: 323
    }
  });
  await page.reload();
  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  
  
  const pin1 = await page.getByLabel('pin', { exact: true }).nth(1);
  await expect(pin1).toBeVisible;
  
  const pin2 = await page.getByLabel('pin', { exact: true }).nth(2);
  await expect(pin2).toBeVisible;
  
  const pin3 = await page.getByLabel('pin', { exact: true }).nth(3);
  await expect(pin3).toBeVisible;
  
  const pin4 = await page.getByLabel('pin', { exact: true }).nth(4);
  await expect(pin4).toBeVisible;

});

// tests that once you click delete, it actually deletes the pins
test('pins are not visible once you click delete', async ({ page }) => {

  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 256,
      y: 193
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 419,
      y: 104
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 536,
      y: 236
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 775,
      y: 133
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 509,
      y: 323
    }
  });
  await page.reload();
  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  
  
  const pin1 = await page.getByLabel('pin', { exact: true }).nth(1);
  await expect(pin1).toBeVisible();
  
  const pin2 = await page.getByLabel('pin', { exact: true }).nth(2);
  await expect(pin2).toBeVisible();
  
  const pin3 = await page.getByLabel('pin', { exact: true }).nth(3);
  await expect(pin3).toBeVisible();
  
  const pin4 = await page.getByLabel('pin', { exact: true }).nth(4);
  await expect(pin4).toBeVisible();

  await page.getByLabel('deletePinButton').click();


  await expect(pin1).not.toBeVisible();
  await expect(pin2).not.toBeVisible();
  await expect(pin3).not.toBeVisible();
  await expect(pin4).not.toBeVisible();

});

// tests that once a user drops pins and signs out of their account, the same pins remain visible once they sign back in
test('pins persist between sign ins and sign outs of the same user', async ({ page }) => {

  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 363,
      y: 196
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 556,
      y: 264
    }
  });

  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('lyra@example.com');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('ckaskandeti123');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();

  const pin1 = await page.getByLabel('pin').first();
  const pin2 = await page.getByLabel('pin').nth(1);
 
  await expect(pin1).toBeVisible;
  await expect(pin2).toBeVisible;


});

// tests that once one user drops pins, they are visible for other authenticated users
test('pins persist between sign ins of different users', async ({ page }) => {

  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 363,
      y: 196
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 556,
      y: 264
    }
  });

  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('nina@example.com');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('ckaskandeti123');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();

  const pin1 = await page.getByLabel('pin').first();
  const pin2 = await page.getByLabel('pin').nth(1);
 
  await expect(pin1).toBeVisible;
  await expect(pin2).toBeVisible;


});

// tests that once a user deletes their own pins, a different authenticated user is not able to see them anymore
test('once a user deletes their own pins, they do not show up for other users either', async ({ page }) => {

  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 256,
      y: 193
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 419,
      y: 104
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 536,
      y: 236
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 775,
      y: 133
    }
  });
  await page.getByLabel('dropPinButton').click();
  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 509,
      y: 323
    }
  });
  await page.reload();
  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  
  
  const pin1 = await page.getByLabel('pin', { exact: true }).nth(1);
  await expect(pin1).toBeVisible();
  
  const pin2 = await page.getByLabel('pin', { exact: true }).nth(2);
  await expect(pin2).toBeVisible();
  
  const pin3 = await page.getByLabel('pin', { exact: true }).nth(3);
  await expect(pin3).toBeVisible();
  
  const pin4 = await page.getByLabel('pin', { exact: true }).nth(4);
  await expect(pin4).toBeVisible();

  await page.getByLabel('deletePinButton').click();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('nina@example.com');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('ckaskandeti123');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();


  await expect(pin1).not.toBeVisible();
  await expect(pin2).not.toBeVisible();
  await expect(pin3).not.toBeVisible();
  await expect(pin4).not.toBeVisible();

});

// tests that coordinate input boxes appear
test('tests that coordinate input boxes appear', async ({ page }) => {

  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  await page.getByText('Min Longitude:').click();
  await page.getByText('Max Longitude:').click();
  await page.getByText('Min Latitude:').click();
  await page.getByText('Max Latitude:').click();
});


// tests that keyword input box appears
test('tests that keyword input boxes appear', async ({ page }) => {

  await page.getByRole('button', { name: 'Section 2: Mapbox Demo' }).click();
  await page.getByText('Keyword:').click();
});




