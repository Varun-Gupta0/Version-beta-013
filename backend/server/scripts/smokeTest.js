#!/usr/bin/env node
/*
  Simple smoke test: register -> login -> fetch profile
  Usage: NODE_ENV=development node scripts/smokeTest.js
  Ensure the backend server is running at BASE_URL (default http://localhost:5000)
*/

const base = process.env.BASE_URL || 'http://localhost:5000';
const fetch = global.fetch || require('node-fetch');

function now() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function run() {
  console.log('Smoke test target:', base);

  const email = process.env.SMOKE_EMAIL || `smoke+${now()}@example.com`;
  const password = process.env.SMOKE_PW || 'P@ssword123!';
  const name = 'Smoke Test';

  try {
    console.log('\n1) Registering user', email);
    const regRes = await fetch(`${base}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const regBody = await regRes.json().catch(() => ({}));
    if (regRes.status === 201) {
      console.log('  Registered OK');
    } else if (regRes.status === 400 && regBody.message && /already exists/i.test(regBody.message)) {
      console.log('  User already exists — will try login');
    } else {
      console.warn('  Register returned', regRes.status, regBody);
    }

    console.log('\n2) Logging in');
    const loginRes = await fetch(`${base}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const loginBody = await loginRes.json().catch(() => ({}));
    if (!loginRes.ok) {
      console.error('  Login failed', loginRes.status, loginBody);
      process.exitCode = 2;
      return;
    }

    const token = loginBody.token;
    if (!token) {
      console.error('  Login did not return token', loginBody);
      process.exitCode = 3;
      return;
    }

    console.log('  Login OK — token received');

    console.log('\n3) Fetching profile with token');
    const profileRes = await fetch(`${base}/api/users/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const profileBody = await profileRes.json().catch(() => ({}));
    if (!profileRes.ok) {
      console.error('  Profile fetch failed', profileRes.status, profileBody);
      process.exitCode = 4;
      return;
    }

    console.log('  Profile fetched OK:\n', profileBody);
    console.log('\nSmoke test completed successfully');
  } catch (err) {
    console.error('Smoke test error', err);
    process.exitCode = 10;
  }
}

run();
