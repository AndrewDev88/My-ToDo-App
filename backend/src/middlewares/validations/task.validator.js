import Joi from 'joi';

const taskSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'Title must be a string',
    'any.required': 'Title is required',
  }),
  description: Joi.string().allow('', null).optional().messages({
    'string.base': 'Description must be a string',
  })
});

export const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation error while creating task',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};