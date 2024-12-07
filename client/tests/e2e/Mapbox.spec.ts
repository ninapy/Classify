import { test, expect } from '@playwright/test';



test('Test redlining GeoJSON response', async ({ request }) => {
  // Define the URL and query parameters
  const url = 'http://localhost:3232/redlining';
  const queryParams = {
    minLon: '-71.4500',
    maxLon: '-71.3700',
    minLat: '41.8000',
    maxLat: '41.8500',
  };

  // Send a GET request to the backend endpoint
  const response = await request.get(url, { params: queryParams });

  // Check if the response is successful
  expect(response.status()).toBe(200);

  // Parse the response as JSON
  const json = await response.json();

  // Check if the response contains the expected GeoJSON structure
  expect(json).toHaveProperty('redlinedData');
  const redlinedData = json.redlinedData[0];

  // Validate the geometry of the first feature in the redlined data
  expect(redlinedData).toHaveProperty('geometry');
  expect(redlinedData.geometry.type).toBe('MultiPolygon');
  expect(redlinedData.geometry.coordinates).toBeInstanceOf(Array);
  expect(redlinedData.geometry.coordinates.length).toBeGreaterThan(0);

  // Validate some properties of the feature
  expect(redlinedData).toHaveProperty('properties');
  expect(redlinedData.properties).toHaveProperty('state', 'RI');
  expect(redlinedData.properties).toHaveProperty('city', 'Providence');
  expect(redlinedData.properties).toHaveProperty('holc_grade', 'A');
});

test('Edge case: Empty response', async ({ request }) => {
    const url = 'http://localhost:3232/redlining';
    const queryParams = {
      minLon: '-72.0000',  // Coordinates where no data is available
      maxLon: '-71.9000',
      minLat: '42.0000',
      maxLat: '42.1000',
    };
  
    const response = await request.get(url, { params: queryParams });
  
    expect(response.status()).toBe(200);
    const json = await response.json();
  
    // Expecting an empty redlinedData array
    expect(json).toHaveProperty('redlinedData');
    expect(json.redlinedData).toHaveLength(0);
  });
  

  
  test('Edge case: Boundary coordinates', async ({ request }) => {
    const url = 'http://localhost:3232/redlining';
    const queryParams = {
      minLon: '-180.0000',  // Minimum longitude boundary
      maxLon: '180.0000',   // Maximum longitude boundary
      minLat: '-90.0000',    // Minimum latitude boundary
      maxLat: '90.0000',     // Maximum latitude boundary
    };
  
    const response = await request.get(url, { params: queryParams });
  
    expect(response.status()).toBe(200);
    const json = await response.json();
  
    // Expect the response to contain data or a well-structured GeoJSON
    expect(json).toHaveProperty('redlinedData');
    expect(json.redlinedData).toBeInstanceOf(Array);
    expect(json.redlinedData.length).toBeGreaterThan(0);
  });
  
  