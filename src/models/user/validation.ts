import * as Joi from 'joi';
import { patterns, options } from '../../lib/validation';

/** Validation schema for User model */
export default Joi.object({
  // Is current operation creation or updation?
  creationMode: Joi.bool().required(),
  name: Joi.string()
    .pattern(patterns.name.regex)
    .messages({
      'string.pattern.base': `'name' ${patterns.name.message}`,
    }),
  email: Joi.string()
    .email()
    .messages({ 'string.email': `'email' ${patterns.email.message}` }),
  password: Joi.string()
    .pattern(patterns.password.regex)
    .min(8)
    .messages({
      'string.pattern.base': `'password' ${patterns.password.message}`,
    }),
})
  .when(Joi.object({ creationMode: true }), {
    then: Joi.object({
      name: Joi.required(),
      email: Joi.required(),
      password: Joi.required(),
    }),
  })
  .options(options);
