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
  password: {
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!#@$%&?])[a-zA-Z0-9_!#@$%&?]{8,}$/,
    message:
      'must contain atleast one lowercase letter, one uppercase letter, one digit and one symbol, and minimum length is 8',
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
