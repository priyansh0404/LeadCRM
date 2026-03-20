const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['New', 'Contacted', 'Converted'],
        default: 'New',
    },
    image: {
        type: String, // Multer stores the file path
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
