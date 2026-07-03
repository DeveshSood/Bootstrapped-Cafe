/**
 * SSE Manager — Manages Server-Sent Event connections for real-time order updates.
 */


const orderClients = new Map();

const dashboardClients = new Set();

function addOrderClient(orderId, res) {
  if (!orderClients.has(orderId)) {
    orderClients.set(orderId, new Set());
  }
  orderClients.get(orderId).add(res);

  res.on('close', () => {
    const clients = orderClients.get(orderId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) orderClients.delete(orderId);
    }
  });
}

function addDashboardClient(res) {
  dashboardClients.add(res);
  res.on('close', () => dashboardClients.delete(res));
}

function broadcastOrderUpdate(orderId, data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;


  const clients = orderClients.get(orderId);
  if (clients) {
    clients.forEach(res => res.write(payload));
  }


  dashboardClients.forEach(res => res.write(payload));
}

/** SSE endpoint: GET /api/orders/:id/stream */
function subscribeToOrder(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });


  res.write(`data: ${JSON.stringify({ type: 'connected', orderId: req.params.id })}\n\n`);

  addOrderClient(req.params.id, res);


  const heartbeat = setInterval(() => {
    res.write(`: heartbeat\n\n`);
  }, 30000);

  res.on('close', () => clearInterval(heartbeat));
}

/** SSE endpoint: GET /api/orders/dashboard/stream */
function subscribeToDashboard(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  res.write(`data: ${JSON.stringify({ type: 'connected', channel: 'dashboard' })}\n\n`);

  addDashboardClient(res);

  const heartbeat = setInterval(() => {
    res.write(`: heartbeat\n\n`);
  }, 30000);

  res.on('close', () => clearInterval(heartbeat));
}

module.exports = { subscribeToOrder, subscribeToDashboard, broadcastOrderUpdate };
