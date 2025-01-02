import http from 'k6/http';
import { sleep, check } from 'k6';

// Define the target URL (replace with your Flask app URL)
const BASE_URL = 'http://localhost:5000'; // Flask default address

// Set the load test parameters
export let options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp up to 10 virtual users over 10 seconds
    { duration: '1m', target: 10 },  // Keep 10 virtual users for 1 minute
    { duration: '10s', target: 0 },  // Ramp down to 0 virtual users
  ],
};

export default function () {
  // Make a POST request to the '/client_register' endpoint
  let response = http.post(`${BASE_URL}/client_register`, JSON.stringify({
    "client_name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890"
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  // Check that the response status is 200
  check(response, {
    'is status 200': (r) => r.status === 200,
  });

  // Add a small sleep to simulate real user activity (optional)
  sleep(1);
}
