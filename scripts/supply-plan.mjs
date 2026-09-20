const resources = [
  ['water_bottles', 'Water Bottles'], ['meals_ready', 'Ready-to-Eat Meals'],
  ['medical_kits', 'First Aid Kits'], ['fuel', 'Fuel'],
];
export function supplyPlan(inventory, requests) {
  return resources.map(([key, name]) => {
    const available = inventory[key] ?? 0;
    if (!Number.isSafeInteger(available) || available < 0) throw new RangeError('Invalid inventory quantity');
    const needed = requests.filter(request => request.deliveryStatus !== 'Delivered')
      .flatMap(request => request.items).filter(item => item.name === name)
      .reduce((total, item) => {
        if (!Number.isSafeInteger(item.quantity) || item.quantity < 0 || !Number.isSafeInteger(total + item.quantity))
          throw new RangeError('Invalid requested quantity');
        return total + item.quantity;
      }, 0);
    return { name, available, needed, shortage: Math.max(0, needed - available) };
  });
}
