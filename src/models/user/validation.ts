import * as Joi from 'joi';
import { patterns, options } from '../../lib/validation';

/** Validation schema for User model */
export default Joi.object({
  // Is current operation creation or updation?
  creationMode: Joi.bool().required(),
  firstname: Joi.string()
    .pattern(patterns.alpha.regex)
    .messages({
      'string.pattern.base': `'firstname' ${patterns.alpha.message}`,
    }),
  middlename: Joi.string()
    .pattern(patterns.alpha.regex)
    .allow('')
    .messages({
      'string.pattern.base': `'middlename' ${patterns.alpha.message}`,
    }),
  lastname: Joi.string()
    .pattern(patterns.alpha.regex)
    .messages({
      'string.pattern.base': `'lastname' ${patterns.alpha.message}`,
    }),
  age: Joi.number(),
  username: Joi.string()
    .pattern(patterns.alphanum.regex)
    .messages({
      'string.pattern.base': `'username' ${patterns.alphanum.message}`,
    }),
  email: Joi.string().email(),
  password: Joi.string()
    .pattern(patterns.password.regex)
    .min(8)
    .messages({
      'string.pattern.base': `'password' ${patterns.password.message}`,
    }),
})
  .when(Joi.object({ creationMode: true }), {
    then: Joi.object({
      firstname: Joi.required(),
      lastname: Joi.required(),
      username: Joi.required(),
      email: Joi.required(),
      password: Joi.required(),
    }),
  })
  .options(options);
