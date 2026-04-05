import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUrl = 'http://localhost:3000';

function makePdfBuffer() {
  const pdfText = `%PDF-1.1\r\n1 0 obj\r\n<< /Type /Catalog /Pages 2 0 R >>\r\nendobj\r\n2 0 obj\r\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\r\nendobj\r\n3 0 obj\r\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\r\nendobj\r\n4 0 obj\r\n<< /Length 44 >>\r\nstream\r\nBT /F1 24 Tf 100 700 Td (Hello World) Tj ET\r\nendstream\r\nendobj\r\n5 0 obj\r\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\r\nendobj\r\nxref\r\n0 6\r\n0000000000 65535 f \r\n0000000010 00000 n \r\n0000000074 00000 n \r\n0000000178 00000 n \r\n0000000329 00000 n \r\n0000000414 00000 n \r\ntrailer\r\n<< /Root 1 0 R /Size 6 >>\r\nstartxref\r\n480\r\n%%EOF\r\n`;
  return Buffer.from(pdfText, 'utf8');
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    json = text;
  }
  return { status: res.status, headers: res.headers, body: json };
}

async function run() {
  const suffix = Date.now();
  const user = {
    username: `testuser${suffix}`,
    email: `testuser${suffix}@example.com`,
    password: 'Password123!',
  };

  console.log('1) Registering user...');
  const register = await requestJson(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  console.log('register status:', register.status);
  console.log('register body:', register.body);

  console.log('\n2) Logging in user...');
  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email, password: user.password }),
    redirect: 'manual',
  });
  const cookie = login.headers.get('set-cookie');
  const loginBody = await login.text();
  let loginJson;
  try {
    loginJson = JSON.parse(loginBody);
  } catch (err) {
    loginJson = loginBody;
  }
  console.log('login status:', login.status);
  console.log('login set-cookie:', cookie);
  console.log('login body:', loginJson);

  if (!cookie) {
    console.log('No cookie received, cannot test authenticated endpoint.');
    return;
  }

  console.log('\n3) Fetching /api/auth/getMe...');
  const getMe = await requestJson(`${baseUrl}/api/auth/getMe`, {
    method: 'GET',
    headers: { Cookie: cookie },
  });
  console.log('getMe status:', getMe.status);
  console.log('getMe body:', getMe.body);

  console.log('\n4) Testing interview report upload route...');

  const formData = new FormData();
  formData.append('file', new Blob([makePdfBuffer()]), 'resume.pdf');
  formData.append('jobDescribe', 'Software engineer role requiring Node.js and backend development');
  formData.append('selfDescribe', 'Experienced backend developer with Node.js and MongoDB experience');

  const interview = await fetch(`${baseUrl}/api/interview`, {
    method: 'POST',
    headers: { Cookie: cookie },
    body: formData,
  });
  const interviewText = await interview.text();
  let interviewJson;
  try {
    interviewJson = JSON.parse(interviewText);
  } catch (err) {
    interviewJson = interviewText;
  }
  console.log('interview status:', interview.status);
  console.log('interview body:', interviewJson);
}

run().catch(err => {
  console.error('Test script failed:', err);
  process.exit(1);
});
