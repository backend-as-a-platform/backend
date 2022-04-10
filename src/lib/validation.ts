/** Regex patterns for Joi schema validation */

const patterns = {
  alpha: {
    regex: /^[a-zA-Z]*$/,
    message: 'must only contain alphabets',
  },
  alphanum: {
    regex: /^[\w]*$/,
    message: 'must only contain alphanumeric characters',
  },
  name: {
    regex: /^[a-zA-Z\s]*$/,
    message: 'must only contain alphabets and whitespaces',
  },
  email: {
    message: 'must be valid',
  },
  password: {
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!#@$%&?])[a-zA-Z0-9_!#@$%&?]{8,}$/,
    message:
      'must contain lowercase, uppercase, digit and special characters, minimum length should be 8',
  },
  formName: {
    regex: /^[\w-]*$/,
    message: 'must only contain alphanumeric and hyphen characters',
  },
};

const options = {
  errors: {
    wrap: {
      label: "'",
    },
  },
};

export { patterns, options };
