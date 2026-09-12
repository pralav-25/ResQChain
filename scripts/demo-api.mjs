// A deliberately local simulation. Each page load starts an isolated workspace.
export function createDemoApi(initialData) {
  let provider = structuredClone(initialData);
  let alert = { message: '', isActive: false, timestamp: null };
  let requests = [];
  const reply = (status, data) => ({ ok: status >= 200 && status < 300, status,
    json: async () => structuredClone(data) });
  return async (path, options = {}) => {
    const method = options.method || 'GET';
    let body;
    try { body = options.body ? JSON.parse(options.body) : {}; }
    catch { return reply(400, { error: 'Invalid request.' }); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, { error: 'Invalid request.' });
    if (path.startsWith('/provider/status/')) {
      if (method === 'GET') return reply(200, provider);
      if (method === 'PUT') {
        if ((body.capacity !== undefined && (!Number.isSafeInteger(body.capacity) || body.capacity < 0)) ||
            (body.inventory !== undefined && (!body.inventory || typeof body.inventory !== 'object' || Array.isArray(body.inventory) ||
              Object.values(body.inventory).some(value => !Number.isSafeInteger(value) || value < 0)))) {
          return reply(422, { error: 'Capacity and inventory must be non-negative whole numbers.' });
        }
        provider = { ...provider, ...body, inventory: { ...provider.inventory, ...body.inventory }, lastUpdated: new Date().toISOString() };
        return reply(200, { success: true, data: provider });
      }
    }
    if (path === '/global/alert') {
      if (method === 'GET') return reply(200, alert);
      if (method === 'PUT') {
        if (typeof body.message !== 'string') return reply(422, { error: 'Enter an alert message.' });
        alert = { message: body.message, isActive: Boolean(body.message.trim()), timestamp: new Date().toISOString() };
        return reply(200, { success: true, data: alert });
      }
    }
    if (path === '/requests' && method === 'GET') return reply(200, requests);
    if (path === '/requests/add_demo' && method === 'POST') {
      if (typeof body.id !== 'string' || !Array.isArray(body.items)) return reply(422, { error: 'Invalid demo request.' });
      if (requests.some(item => item.id === body.id)) return reply(409, { error: 'Request already exists.' });
      requests.unshift(structuredClone(body));
      return reply(201, { success: true });
    }
    if (path === '/requests/update' && method === 'PUT') {
      const request = requests.find(item => item.id === body.id);
      if (!request) return reply(404, { error: 'Request not found.' });
      const updates = body.updates;
      if (!updates || typeof updates !== 'object' ||
          (updates.status !== undefined && !['Pending', 'In Process', 'Packed'].includes(updates.status)) ||
          (updates.deliveryStatus !== undefined && !['Not Sent', 'In Transit', 'Delivered'].includes(updates.deliveryStatus))) {
        return reply(422, { error: 'Invalid request status.' });
      }
      for (const key of ['status', 'deliveryStatus']) if (updates[key] !== undefined) request[key] = updates[key];
      return reply(200, { success: true, data: request });
    }
    if (path.startsWith('/requests/delete/') && method === 'DELETE') {
      const id = path.split('/').pop();
      if (!requests.some(item => item.id === id)) return reply(404, { error: 'Request not found.' });
      requests = requests.filter(item => item.id !== id);
      return reply(200, { success: true });
    }
    return reply(404, { error: 'Unknown demo action.' });
  };
}
