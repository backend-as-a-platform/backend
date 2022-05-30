import * as Joi from 'joi';
import { patterns, options } from '../../lib/validation';

export default Joi.object({
  creationMode: Joi.bool().required(),
  name: Joi.string()
    .pattern(patterns.formName.regex)
    .messages({
      'string.pattern.base': `'name' ${patterns.formName.message}`,
    }),
  fields: Joi.array().min(1),
  test: Joi.boolean(),
})
  .when(Joi.object({ creationMode: true }), {
    then: Joi.object({ name: Joi.required() }),
  })
  .when(Joi.object({ creationMode: true, test: false }), {
    then: Joi.object({ fields: Joi.required() }),
  })
  .options(options);
