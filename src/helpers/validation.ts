/** Helper for Joi validation schema */

const patterns = {
  alpha: {
    regex: /^[a-zA-Z]*$/,
    message: 'must only contain alphabets',
  },
  alphanum: {
    regex: /^[\w]*$/,
    message: 'must only contain alpha-numeric characters',
  },
  password: {
    regex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!#@$%&?])[a-zA-Z0-9_!#@$%&?]{8,}$/,
    message:
      'must contain atleast one lowercase letter, one uppercase letter, one digit and one symbol',
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
