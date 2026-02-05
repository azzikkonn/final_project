const Joi = require('joi');

const createPhotoSchema = Joi.object({
  title: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Photo title is required'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  imageUrl: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Image URL must be a valid URL',
      'any.required': 'Image URL is required'
    }),
  category: Joi.string()
    .valid('landscape', 'portrait', 'street', 'nature', 'architecture', 'wildlife', 'macro', 'abstract', 'other')
    .default('other')
    .messages({
      'any.only': 'Category must be one of: landscape, portrait, street, nature, architecture, wildlife, macro, abstract, other'
    }),
  tags: Joi.array()
    .items(Joi.string().max(50))
    .max(10)
    .messages({
      'array.max': 'Cannot have more than 10 tags'
    })
});

const updatePhotoSchema = Joi.object({
  title: Joi.string()
    .max(100)
    .messages({
      'string.max': 'Title cannot exceed 100 characters'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  imageUrl: Joi.string()
    .uri()
    .messages({
      'string.uri': 'Image URL must be a valid URL'
    }),
  category: Joi.string()
    .valid('landscape', 'portrait', 'street', 'nature', 'architecture', 'wildlife', 'macro', 'abstract', 'other')
    .messages({
      'any.only': 'Category must be one of: landscape, portrait, street, nature, architecture, wildlife, macro, abstract, other'
    }),
  tags: Joi.array()
    .items(Joi.string().max(50))
    .max(10)
    .messages({
      'array.max': 'Cannot have more than 10 tags'
    })
});

module.exports = { createPhotoSchema, updatePhotoSchema };
