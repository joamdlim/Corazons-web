fetch('http://localhost:3000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'Test Server',
    email: 'test@example.com',
    cakeType: 'Vanilla',
    cakeName: 'Classic Vanilla',
  })
}).then(res => res.text()).then(console.log).catch(console.error);
