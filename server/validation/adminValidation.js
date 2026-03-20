const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required().trim(),
        email: Joi.string().email().required().trim().lowercase(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        identifier: Joi.string().required().trim().lowercase(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
