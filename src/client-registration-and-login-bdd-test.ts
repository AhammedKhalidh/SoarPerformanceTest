import http from 'k6/http';
import { check, sleep } from 'k6';

// Define the base URL of the Flask app (adjust to match the actual URL)
const BASE_URL = 'http://localhost:5000'; // Update to the correct URL

function generateRandomPassword(length: number = 12): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

function generateRandomPhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900 + 100);  // 3 digits
  const firstPart = Math.floor(Math.random() * 900 + 100);  // 3 digits
  const secondPart = Math.floor(Math.random() * 9000 + 1000);  // 4 digits
  return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
}
// K6 options
export let options = {
  stages: [
    { duration: '5s', target: 10 },  // Ramp up to 10 virtual users
    { duration: '5m', target: 50 },  // Maintain 50 virtual users to stress-test
    { duration: '10s', target: 0 },  // Ramp down to 0 virtual users
  ],
};

// BDD-like structure using Given, When, Then for /client_register and /client_login
export default function () {
  // Scenario: Register user and then log in
  
  // Given that a new user wants to register
  let registrationPayload = {
    phone_number: generateRandomPhoneNumber(), // Random phone number
    password: generateRandomPassword(12),        // Random password of 12 characters
  };

  let registrationRes = http.post(`${BASE_URL}/client_register`, JSON.stringify(registrationPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  // Then the registration should be successful
  check(registrationRes, {
    'registration status is 200': (r) => r.status === 200,
  });

  // Sleep to simulate realistic behavior between actions
  sleep(1);

  // Given that the user has successfully registered, proceed to login
  let loginPayload = {
    phone_number: registrationPayload.phone_number,
    password: registrationPayload.password,
  };

  // When the user logs in with the registered details
  let loginRes = http.post(`${BASE_URL}/client_login`, JSON.stringify(loginPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  // Then the login should be successful and return status 200
  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
  });

  // Sleep to simulate realistic behavior
  sleep(1);
}
