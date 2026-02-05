const Joi = require('joi');

const updateProfileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .messages({
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username cannot exceed 30 characters'
    }),
  bio: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Bio cannot exceed 500 characters'
    }),
  avatar: Joi.string()
    .uri()
    .allow('')
    .messages({
      'string.uri': 'Avatar must be a valid URL'
    })
});

module.exports = { updateProfileSchema };
