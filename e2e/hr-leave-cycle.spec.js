const { test, expect } = require('@playwright/test');
const { BACKEND_URL } = require('./utils/data');

async function login(request, email, password) {
  const response = await request.post(`${BACKEND_URL}/api/user/auth/login`, {
    data: { email, password }, timeout: 60000,
  });
  expect(response.ok()).toBeTruthy();
  return { Authorization: `Bearer ${(await response.json()).data.access_token}` };
}

async function getData(request, path, headers) {
  const response = await request.get(`${BACKEND_URL}${path}`, { headers });
  expect(response.ok()).toBeTruthy();
  return (await response.json()).data;
}

test('a leave request reserves balance and cancellation restores it', async ({ request }) => {
  const { E2E_HR_OWNER_EMAIL, E2E_HR_OWNER_PASSWORD, E2E_HR_EMPLOYEE_EMAIL, E2E_HR_EMPLOYEE_PASSWORD } = process.env;
  test.skip(
    !E2E_HR_OWNER_EMAIL || !E2E_HR_OWNER_PASSWORD || !E2E_HR_EMPLOYEE_EMAIL || !E2E_HR_EMPLOYEE_PASSWORD,
    'HR owner and employee test accounts are required',
  );

  const owner = await login(request, E2E_HR_OWNER_EMAIL, E2E_HR_OWNER_PASSWORD);
  const employee = await login(request, E2E_HR_EMPLOYEE_EMAIL, E2E_HR_EMPLOYEE_PASSWORD);
  const user = await getData(request, '/api/user/auth', employee);
  const policies = await getData(request, '/api/subscriber/organization/leave-policies', owner);
  const policy = policies.find(item => item.code === 'E2E_TEST');
  expect(policy, 'the test organization needs an E2E_TEST policy').toBeTruthy();
  const balancePath = `/api/subscriber/organization/employees/${user._id}/leave-balances`;
  const readBalance = async () => (await getData(request, balancePath, owner))
    .find(item => String(item.policy?._id) === String(policy._id));
  const before = await readBalance();
  expect(before.balance).toBeGreaterThanOrEqual(1);

  const date = new Date(Date.now() + 47 * 86400000).toISOString().slice(0, 10);
  let requestId;
  try {
    const response = await request.post(`${BACKEND_URL}/api/employee/employee-requests`, {
      headers: employee,
      data: {
        employee_id: user._id, type: 'DAY_OFF', reason: 'HR E2E leave cycle',
        vacation_date: date, leave_policy_id: policy._id,
      },
    });
    expect(response.status()).toBe(200);
    requestId = (await response.json()).data._id;
    const held = await readBalance();
    expect(held.balance).toBe(before.balance - 1);
    expect(held.held).toBe(before.held + 1);
  } finally {
    if (requestId) {
      const response = await request.put(
        `${BACKEND_URL}/api/employee/employee-requests/${requestId}/cancel`,
        { headers: employee },
      );
      expect(response.status()).toBe(200);
    }
  }

  const restored = await readBalance();
  expect(restored.balance).toBe(before.balance);
  expect(restored.held).toBe(before.held);
});
