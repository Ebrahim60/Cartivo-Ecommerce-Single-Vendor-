import Joi from 'joi';

//login user validation
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

//register user validation
export const registerUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

//Product Validation
export const productSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().trim().required(),
    stock: Joi.number().integer().min(0).required(),
});