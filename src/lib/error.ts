/** Common HTTP errors */
const errors = {
  400: 'bad request',
  401: 'unauthorized',
  402: 'payment required',
  403: 'forbidden',
  404: 'not found',
  500: 'internal server error',
};

/** Sets error if request fails */
const setError = (code: number, reason?: string): Record<string, any> => ({
  code,
  status: errors[code],
  reason,
});

/** Throws user-friendly error
 *  for MongoDB duplicate index (code: E11000)
 **/
const throwDuplicate = (err: Record<string, any>): Error => {
  const key = err.message.split('_1')[0].split(': ')[2];

  throw { code: 11000, message: `'${key}' is already taken` };
};

/** For MongoDB 'required' error */
const throwRequired = (err: Record<string, any>): Error => {
  const message = err.message.split('.').map((msg) => {
    try {
      return msg.split('Path ')[1].split('`').join("'");
    } catch (_) {
      null;
    }
  });

  message.pop();

  throw { status: 400, reason: message.length === 1 ? message[0] : message };
};

const throwExportError = (message: string): Error => {
  throw { type: 'export', message };
};

/** Server will log the error and panic */
const panic = (err: string): void => {
  console.error(err);
  process.exit(1);
};

export { setError, throwDuplicate, throwRequired, throwExportError, panic };
