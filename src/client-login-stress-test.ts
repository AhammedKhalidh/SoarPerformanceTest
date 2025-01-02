import http from 'k6/http';
import { check, sleep } from 'k6';

// Define the base URL of the Flask app (adjust to match the actual URL)
const BASE_URL = 'http://localhost:5000'; // Default Flask URL

// k6 options for load test, especially stress testing beyond the server's limit
export let options = {
  stages: [
    { duration: '5s', target: 10 },   // Ramp up to 10 virtual users within 5 seconds
    { duration: '5m', target: 50 },   // Maintain 50 virtual users for 5 minutes (to stress test)
    { duration: '10s', target: 0 },   // Ramp down to 0 virtual users in 10 seconds
  ],
};

export default function () {
  // Define the payload for the /client_login endpoint
  const payload = JSON.stringify({
    phone_number: "1234567890", // Replace with a valid phone number for testing
    password: "TestPassword123", // Replace with the appropriate test password
  });

  // Make a POST request to the /client_login endpoint
  let response = http.post(`${BASE_URL}/client_login`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Check if the response status is 200 (success)
  check(response, {
    'is status 200': (r) => r.status === 200,
  });

  // Sleep to simulate real user activity
  sleep(1);
}
