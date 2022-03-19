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
const throwDuplicate = (err: Error): Error => {
  const key = err.message.split('_1')[0].split(': ')[2];

  throw new Error(`'${key}' is already taken`);
};

/** Server will log the error and panic */
const panic = (err: string): void => {
  console.error(err);
  process.exit(1);
};

export { setError, throwDuplicate, panic };
