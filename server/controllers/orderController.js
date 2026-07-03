const Order = require('../models/Order');
const Counter = require('../models/Counter');
const { broadcastOrderUpdate } = require('./sseController');


const STATUS_FLOW = {
  pending: 'payment_confirmed',
  payment_confirmed: 'accepted',
  accepted: 'prepared',
  prepared: 'packaged',
  packaged: 'assigned_to_partner',
  assigned_to_partner: 'handed_to_partner',
};

// ─── Create Order ───────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const data = { ...req.body };


    if (req.user) {
      data.user = req.user._id;
    }


    if (data.customerAddress && typeof data.customerAddress === 'string') {
      data.deliveryAddress = { formatted: data.customerAddress };
      delete data.customerAddress;
    }


    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    
    const counterId = `orderSeq_${now.getFullYear()}`;
    const counter = await Counter.findByIdAndUpdate(
      counterId,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    const ornr = counter.seq.toString().padStart(4, '0');
    data.orderNumber = `O${yy}RD-${dd}${ornr}${mm}BSC`;

    const order = await Order.create(data);


    broadcastOrderUpdate(order._id.toString(), {
      type: 'new_order',
      order,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── Get Order by ID ────────────────────────────────────
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Orders for Logged-In User ──────────────────────
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get All Orders (restaurant/admin) ──────────────────
exports.getAllOrders = async (req, res) => {
  try {
    const { status, deleted, page = 1, limit = 50 } = req.query;
    const filter = {};
    

    if (deleted === 'true') {
      filter.isDeleted = true;
    } else {
      filter.isDeleted = { $ne: true };
      if (status && status !== 'all') filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('user', 'name email phone')
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Advance Order Status ───────────────────────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'handed_to_partner' || order.status === 'cancelled') {
      return res.status(400).json({ message: `Cannot update a ${order.status} order` });
    }

    const nextStatus = STATUS_FLOW[order.status];
    if (!nextStatus) {
      return res.status(400).json({ message: `No valid next status from '${order.status}'` });
    }

    order.status = nextStatus;
    
    if (nextStatus === 'accepted') {
      const { prepTime } = req.body;
      if (prepTime) {
        order.estimatedPrepTime = Number(prepTime);
        order.acceptedAt = new Date();
      }
    }
    
    if (nextStatus === 'handed_to_partner') {
      order.deliveredAt = new Date(); // Reusing this field to mark completion
    }
    order.statusHistory.push({
      status: nextStatus,
      timestamp: new Date(),
      updatedBy: req.user._id,
    });

    await order.save();


    broadcastOrderUpdate(order._id.toString(), {
      type: 'status_update',
      orderId: order._id,
      status: order.status,
      statusHistory: order.statusHistory,
      updatedAt: new Date(),
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Request Cancellation ─────────────────────────────────
exports.requestCancellation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'handed_to_partner' || order.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel a completed order' });
    }

    if (order.cancelRequest.status === 'pending') {
      return res.status(400).json({ message: 'A cancellation request is already pending' });
    }

    order.cancelRequest = {
      requestedBy: req.user._id,
      reason: req.body.reason || '',
      status: 'pending',
      requestedAt: new Date(),
    };

    await order.save();

    broadcastOrderUpdate(order._id.toString(), {
      type: 'cancel_requested',
      orderId: order._id,
      cancelRequest: order.cancelRequest,
    });

    res.json({ message: 'Cancellation request submitted', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Approve Cancellation (admin only) ──────────────────
exports.approveCancellation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.cancelRequest.status !== 'pending') {
      return res.status(400).json({ message: 'No pending cancellation request' });
    }

    order.cancelRequest.status = 'approved';
    order.cancelRequest.resolvedAt = new Date();
    order.cancelRequest.resolvedBy = req.user._id;
    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      updatedBy: req.user._id,
      note: `Cancelled: ${order.cancelRequest.reason}`,
    });

    await order.save();

    broadcastOrderUpdate(order._id.toString(), {
      type: 'status_update',
      orderId: order._id,
      status: 'cancelled',
      statusHistory: order.statusHistory,
    });

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Reject Cancellation (admin only) ───────────────────
exports.rejectCancellation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.cancelRequest.status !== 'pending') {
      return res.status(400).json({ message: 'No pending cancellation request' });
    }

    order.cancelRequest.status = 'rejected';
    order.cancelRequest.resolvedAt = new Date();
    order.cancelRequest.resolvedBy = req.user._id;

    await order.save();

    broadcastOrderUpdate(order._id.toString(), {
      type: 'cancel_rejected',
      orderId: order._id,
    });

    res.json({ message: 'Cancellation request rejected', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete Order ─────────────────────────────────────────
exports.deleteOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: 'A reason is required for deletion' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isDeleted = true;
    order.deletedReason = reason;
    order.deletedAt = new Date();
    order.deletedBy = req.user._id;


    if (order.status !== 'handed_to_partner' && order.status !== 'cancelled') {
      order.status = 'cancelled';
      order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), updatedBy: req.user._id, note: 'Cancellation approved by admin' });
    }

    await order.save();
    

    broadcastOrderUpdate(order._id.toString(), {
      type: 'status_update',
      orderId: order._id,
      status: order.status,
      statusHistory: order.statusHistory,
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Sequence (admin) ────────────────────────────
exports.updateSequence = async (req, res) => {
  try {
    const { newSequence } = req.body;
    if (newSequence === undefined || newSequence < 0) {
      return res.status(400).json({ message: 'Valid sequence number is required' });
    }

    const now = new Date();
    const year = now.getFullYear();
    
    await Counter.findByIdAndUpdate(
      `orderSeq_${year}`,
      { $set: { seq: newSequence } },
      { upsert: true }
    );

    res.json({ message: 'Sequence updated successfully', sequence: newSequence });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Order Stats (admin) ────────────────────────────────
exports.getOrderStats = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);


    const yearlyCount = await Order.countDocuments({
      createdAt: { $gte: startOfYear },
    });


    const counter = await Counter.findById(`orderSeq_${year}`);
    const currentSeq = counter ? counter.seq : 0;


    const activeStatuses = ['pending', 'payment_confirmed', 'accepted', 'prepared', 'packaged', 'assigned_to_partner'];
    const activeCount = await Order.countDocuments({
      status: { $in: activeStatuses },
    });
    const deliveredCount = await Order.countDocuments({ status: 'handed_to_partner' });
    const cancelledCount = await Order.countDocuments({ status: 'cancelled' });

    res.json({
      yearlyOrderCount: yearlyCount,
      currentSequence: currentSeq,
      year,
      activeCount,
      deliveredCount,
      cancelledCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
