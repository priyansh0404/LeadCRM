const Joi = require('joi');

const leadCreateValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        email: Joi.string().email().required().trim().lowercase(),
        phone: Joi.string().min(10).required().trim(),
        status: Joi.string().valid('New', 'Contacted', 'Converted').default('New'),
    });
    return schema.validate(data);
};

const leadUpdateValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim(),
        email: Joi.string().email().trim().lowercase(),
        phone: Joi.string().min(10).trim(),
        status: Joi.string().valid('New', 'Contacted', 'Converted'),
    });
    return schema.validate(data);
};

module.exports = { leadCreateValidation, leadUpdateValidation };
