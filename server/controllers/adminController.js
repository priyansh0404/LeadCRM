const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { registerValidation, loginValidation } = require('../validation/adminValidation');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc Register admin
// @route POST /api/admin/register
// @access Public
const registerAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const adminExistsByEmail = await Admin.findOne({ email });
    const adminExistsByUsername = await Admin.findOne({ username });
    if (adminExistsByEmail || adminExistsByUsername) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({ username, email, password });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

// @desc Login admin
// @route POST /api/admin/login
// @access Public
const loginAdmin = async (req, res) => {
    const { identifier, password } = req.body;

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Search by email OR username
    const admin = await Admin.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { username: identifier }
        ]
    }).select('+password');

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email/username or password' });
    }
};

module.exports = { registerAdmin, loginAdmin };
