import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoApi } from '../scripts/demo-api.mjs';
const initial = { capacity: 100, inventory: { water_bottles: 500, meals_ready: 250 } };
const write = (method, body) => ({ method, body: JSON.stringify(body) });
test('provider edits persist within one demo and preserve unrelated inventory', async () => {
  const api = createDemoApi(initial);
  assert.equal((await api('/provider/status/demo', write('PUT', { capacity: 50, inventory: { water_bottles: 9 } }))).status, 200);
  const data = await (await api('/provider/status/demo')).json();
  assert.equal(data.capacity, 50); assert.equal(data.inventory.meals_ready, 250);
  data.capacity = 999;
  assert.equal((await (await api('/provider/status/demo')).json()).capacity, 50);
  assert.equal((await (await createDemoApi(initial)('/provider/status/demo')).json()).capacity, 100);
});
test('requests can be created, packed, delivered and removed', async () => {
  const api = createDemoApi(initial);
  const item = { id: 'request-1', items: [], status: 'Pending', deliveryStatus: 'Not Sent' };
  assert.equal((await api('/requests/add_demo', write('POST', item))).status, 201);
  assert.equal((await api('/requests/add_demo', write('POST', item))).status, 409);
  assert.equal((await api('/requests/update', write('PUT', { id: item.id, updates: { status: 'In Process' } }))).status, 200);
  assert.equal((await api('/requests/update', write('PUT', { id: item.id, updates: { status: 'Packed', deliveryStatus: 'Delivered' } }))).status, 200);
  assert.equal((await (await api('/requests')).json())[0].deliveryStatus, 'Delivered');
  assert.equal((await api('/requests/delete/request-1', { method: 'DELETE' })).status, 200);
  assert.deepEqual(await (await api('/requests')).json(), []);
});
test('invalid counts and status changes fail without altering saved data', async () => {
  const api = createDemoApi(initial);
  for (const capacity of [-1, 1.5, 'abc']) assert.equal((await api('/provider/status/demo', write('PUT', { capacity }))).status, 422);
  assert.equal((await api('/provider/status/demo', write('PUT', { inventory: { water_bottles: -3 } }))).status, 422);
  assert.equal((await api('/requests/update', write('PUT', { id: 'missing', updates: {} }))).status, 404);
  assert.equal((await api('/provider/status/demo', { method: 'PUT', body: '{' })).status, 400);
  assert.equal((await (await api('/provider/status/demo')).json()).capacity, 100);
});
test('alerts remain inside the demo instance', async () => {
  const api = createDemoApi(initial);
  await api('/global/alert', write('PUT', { message: 'Practice alert' }));
  assert.equal((await (await api('/global/alert')).json()).message, 'Practice alert');
  assert.equal((await (await createDemoApi(initial)('/global/alert')).json()).isActive, false);
});
