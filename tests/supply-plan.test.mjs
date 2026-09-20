import { test } from 'node:test';
import assert from 'node:assert/strict';
import { supplyPlan } from '../scripts/supply-plan.mjs';
test('restock planning totals outstanding requests and ignores delivered ones', () => {
  const request = (quantity, deliveryStatus = 'Not Sent') => ({ deliveryStatus, items: [{ name: 'Water Bottles', quantity }] });
  const inventory = { water_bottles: 10, meals_ready: 50 };
  const requests = [request(7), request(8, 'In Transit'), request(100, 'Delivered')];
  assert.deepEqual(supplyPlan(inventory, requests)[0], { name: 'Water Bottles', available: 10, needed: 15, shortage: 5 });
  assert.equal(supplyPlan({ ...inventory, water_bottles: 20 }, requests)[0].shortage, 0);
  assert.equal(inventory.water_bottles, 10);
  assert.equal(supplyPlan(inventory, [])[0].needed, 0);
});
test('a malformed quantity cannot create a misleading negative shortage', () => {
  assert.throws(() => supplyPlan({ water_bottles: -1 }, []), RangeError);
  assert.throws(() => supplyPlan({}, [{ items: [{ name: 'Fuel', quantity: -3 }] }]), RangeError);
});
