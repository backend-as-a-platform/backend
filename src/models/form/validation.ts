import * as Joi from 'joi';
import { patterns, options } from '../../lib/validation';

export default Joi.object({
  creationMode: Joi.bool().required(),
  name: Joi.string()
    .pattern(patterns.formName.regex)
    .messages({
      'string.pattern.base': `'name' ${patterns.formName.message}`,
    }),
  fields: Joi.array().required(),
})
  .when(Joi.object({ creationMode: true }), {
    then: Joi.object({ name: Joi.required() }),
  })
  .options(options);
