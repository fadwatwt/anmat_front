const { test, expect } = require('@playwright/test');
const { BACKEND_URL } = require('./utils/data');

const accounts = [
  { email: process.env.E2E_HR_ORG_A_EMAIL, password: process.env.E2E_HR_ORG_A_PASSWORD },
  { email: process.env.E2E_HR_ORG_B_EMAIL, password: process.env.E2E_HR_ORG_B_PASSWORD },
];

async function session(request, account) {
  const response = await request.post(`${BACKEND_URL}/api/user/auth/login`, {
    data: account,
    timeout: 60000,
  });
  expect(response.ok(), `login failed for ${account.email}: ${response.status()}`).toBeTruthy();
  const payload = await response.json();
  return { Authorization: `Bearer ${payload.data.access_token}` };
}

async function data(request, path, headers) {
  const response = await request.get(`${BACKEND_URL}${path}`, { headers });
  expect(response.ok(), `${path} returned ${response.status()}`).toBeTruthy();
  return (await response.json()).data;
}

test('two organizations keep HR policies and employee balances isolated', async ({ request }) => {
  test.skip(accounts.some(account => !account.email || !account.password), 'Two test-organization accounts are required');

  const [a, b] = await Promise.all(accounts.map(account => session(request, account)));
  const [orgA, orgB] = await Promise.all([
    data(request, '/api/subscriber/organization', a),
    data(request, '/api/subscriber/organization', b),
  ]);
  expect(String(orgA._id)).not.toBe(String(orgB._id));

  const [policiesA, policiesB, employeesA, employeesB] = await Promise.all([
    data(request, '/api/subscriber/organization/leave-policies', a),
    data(request, '/api/subscriber/organization/leave-policies', b),
    data(request, '/api/subscriber/organization/employees', a),
    data(request, '/api/subscriber/organization/employees', b),
  ]);
  expect(Array.isArray(policiesA)).toBe(true);
  expect(Array.isArray(policiesB)).toBe(true);
  expect(policiesA.every(policy => String(policy.organization_id) === String(orgA._id))).toBe(true);
  expect(policiesB.every(policy => String(policy.organization_id) === String(orgB._id))).toBe(true);

  const [requestsA, requestsB] = await Promise.all([
    data(request, '/api/subscriber/organization/employees-requests', a),
    data(request, '/api/subscriber/organization/employees-requests', b),
  ]);
  expect(Array.isArray(requestsA)).toBe(true);
  expect(Array.isArray(requestsB)).toBe(true);
  expect(requestsA.every(item => String(item.organization_id) === String(orgA._id))).toBe(true);
  expect(requestsB.every(item => String(item.organization_id) === String(orgB._id))).toBe(true);

  const scopedCollections = [
    ['/api/subscriber/organization/attendances', 'attendance'],
    ['/api/subscriber/organization/employees-salary-transactions', 'salary'],
  ];
  for (const [path, label] of scopedCollections) {
    const [itemsA, itemsB] = await Promise.all([data(request, path, a), data(request, path, b)]);
    expect(Array.isArray(itemsA), `${label} list for organization A`).toBe(true);
    expect(Array.isArray(itemsB), `${label} list for organization B`).toBe(true);
    expect(itemsA.every(item => String(item.organization_id) === String(orgA._id))).toBe(true);
    expect(itemsB.every(item => String(item.organization_id) === String(orgB._id))).toBe(true);
  }

  const listA = Array.isArray(employeesA) ? employeesA : employeesA.employees || employeesA.items || [];
  const listB = Array.isArray(employeesB) ? employeesB : employeesB.employees || employeesB.items || [];
  console.log(`HR isolation fixtures: org A employees=${listA.length}, policies=${policiesA.length}, requests=${requestsA.length}; org B employees=${listB.length}, policies=${policiesB.length}, requests=${requestsB.length}`);
  expect(listA.every(employee => String(employee.organization_id) === String(orgA._id))).toBe(true);
  expect(listB.every(employee => String(employee.organization_id) === String(orgB._id))).toBe(true);

  const employeeA = listA.find(employee => employee.user_id);
  const foreignPolicy = policiesB.find(policy => policy._id);
  expect(employeeA, 'organization A needs a test employee for cross-organization balance access').toBeTruthy();
  expect(foreignPolicy, 'organization B needs a test leave policy for cross-organization policy access').toBeTruthy();

  const crossBalance = await request.get(
    `${BACKEND_URL}/api/subscriber/organization/employees/${employeeA.user_id}/leave-balances`,
    { headers: b },
  );
  expect(crossBalance.status()).toBe(404);

  const crossPolicyUpdate = await request.patch(
    `${BACKEND_URL}/api/subscriber/organization/leave-policies/${foreignPolicy._id}/default`,
    { headers: a },
  );
  expect(crossPolicyUpdate.status()).toBe(404);
});
