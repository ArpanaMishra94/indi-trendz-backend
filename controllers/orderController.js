const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
    const { user, products, totalAmount } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Check if all products exist
        const productIds = products.map(product => product.product);
        const existingProducts = await Product.find({ _id: { $in: productIds } });
        if (existingProducts.length !== products.length) {
            return res.status(400).json({ msg: 'One or more products not found' });
        }

        // Build order object
        const newOrder = new Order({
            user,
            products,
            totalAmount,
        });

        // Save order
        const order = await newOrder.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('products.product', 'name price');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('products.product', 'name price');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Update order by ID
exports.updateOrderById = async (req, res) => {
    const { user, products, totalAmount } = req.body;

    // Build order object
    const orderFields = {};
    if (user) orderFields.user = user;
    if (products) orderFields.products = products;
    if (totalAmount) orderFields.totalAmount = totalAmount;

    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Update order
        order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: orderFields },
            { new: true }
        ).populate('user', 'name email').populate('products.product', 'name price');

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete order by ID
exports.deleteOrderById = async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Remove order
        await Order.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Order removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
