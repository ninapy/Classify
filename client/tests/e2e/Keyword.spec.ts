import { test, expect } from '@playwright/test';

test('Valid keyword returns correct data', async ({ request }) => {
  const url = 'http://localhost:3232/searchDescriptions';  // Updated URL for the handler
  const queryParams = { keyword: 'Providence' };

  const response = await request.get(url, { params: queryParams });

  expect(response.status()).toBe(200);
  const json = await response.json();

  // Check if the response contains the correct keyword data
  expect(json).toHaveProperty('keywordData');
  expect(Array.isArray(json.keywordData)).toBeTruthy();
  expect(json.keywordData.length).toBeGreaterThan(0);  // At least one result should be matched
});

test('Missing keyword returns 400 error', async ({ request }) => {
  const url = 'http://localhost:3232/searchDescriptions';  // Updated URL for the handler
  const queryParams = {};  // Missing keyword

  const response = await request.get(url, { params: queryParams });

  expect(response.status()).toBe(400);
  const json = await response.json();
  expect(json).toHaveProperty('error', 'Missing keyword.');
});

test('Keyword not found returns empty result', async ({ request }) => {
  const url = 'http://localhost:3232/searchDescriptions';  // Updated URL for the handler
  const queryParams = { keyword: 'NonexistentKeyword' };

  const response = await request.get(url, { params: queryParams });

  expect(response.status()).toBe(200);
  const json = await response.json();
  expect(json).toHaveProperty('keywordData');
  expect(json.keywordData).toHaveLength(0);  // No matching data should be found
});

test('Case insensitive search', async ({ request }) => {
  const url = 'http://localhost:3232/searchDescriptions';  // Updated URL for the handler
  const queryParams = { keyword: 'providence' };  // Lowercase version of "Providence"

  const response = await request.get(url, { params: queryParams });

  expect(response.status()).toBe(200);
  const json = await response.json();

  // Ensure the handler works regardless of case sensitivity
  expect(json).toHaveProperty('keywordData');
  expect(Array.isArray(json.keywordData)).toBeTruthy();
  expect(json.keywordData.length).toBeGreaterThan(0);
});



