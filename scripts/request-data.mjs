// The local simulation and its renderers share one aid-request data contract.
const packingStatuses = ['Pending', 'In Process', 'Packed'];
const deliveryStatuses = ['Not Sent', 'In Transit', 'Delivered'];
const record = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export function validStatusPatch(updates) {
  return record(updates) &&
    (updates.status === undefined || packingStatuses.includes(updates.status)) &&
    (updates.deliveryStatus === undefined || deliveryStatuses.includes(updates.deliveryStatus));
}

export function normalizeAidRequest(value) {
  if (!record(value) || typeof value.id !== 'string' || !value.id.trim() ||
      !Array.isArray(value.items) || value.items.some(item => !record(item) ||
        typeof item.name !== 'string' || !item.name.trim() ||
        !Number.isSafeInteger(item.quantity) || item.quantity <= 0)) return null;
  const request = {
    ...value,
    status: value.status === undefined ? 'Pending' : value.status,
    deliveryStatus: value.deliveryStatus === undefined ? 'Not Sent' : value.deliveryStatus,
  };
  if (!validStatusPatch(request)) return null;
  for (const [key, fallback] of Object.entries({ needyName: 'Demo recipient', address: 'Not supplied', priority: 'Medium' })) {
    if (request[key] === undefined) request[key] = fallback;
    if (typeof request[key] !== 'string') return null;
  }
  return request;
}
