const Lead = require('../models/Lead');
const { leadCreateValidation, leadUpdateValidation } = require('../validation/leadValidation');
const nodemailer = require('nodemailer');

// @desc Get leads
// @route GET /api/leads
// @access Private (Admin)
const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({}).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add lead
// @route POST /api/leads
// @access Private (Admin)
const createLead = async (req, res) => {
    const { name, email, phone, status } = req.body;
    let image = req.file ? req.file.path : '';

    const { error } = leadCreateValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const leadExists = await Lead.findOne({ email });
    if (leadExists) {
        return res.status(400).json({ message: 'Lead with this email already exists' });
    }

    const lead = await Lead.create({ name, email, phone, status, image });

    if (lead) {
        res.status(201).json(lead);
    } else {
        res.status(400).json({ message: 'Invalid lead data' });
    }
};

// @desc Update lead status & notification
// @route PUT /api/leads/:id
// @access Private (Admin)
const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (lead) {
            const { name, email, phone, status } = req.body;
            let image = req.file ? req.file.path : lead.image;

            const { error } = leadUpdateValidation(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });

            const oldStatus = lead.status;
            
            lead.name = name || lead.name;
            lead.email = email || lead.email;
            lead.phone = phone || lead.phone;
            lead.status = status || lead.status;
            lead.image = image;

            const updatedLead = await lead.save();

            // Notify lead if status changed to Contacted or Converted
            if (status && oldStatus !== status) {
                await sendNotification(lead.email, status);
            }

            res.json(updatedLead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete lead
// @route DELETE /api/leads/:id
// @access Private (Admin)
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (lead) {
            await lead.deleteOne();
            res.json({ message: 'Lead removed' });
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to send email notification
const sendNotification = async (email, status) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Lead status update - CRM System',
            text: `Dear Lead, your status has been updated to: ${status}. We will be in touch soon.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to ${email}`);
    } catch (error) {
        console.error('Email notification error:', error.message);
    }
};

module.exports = { getLeads, createLead, updateLead, deleteLead };
