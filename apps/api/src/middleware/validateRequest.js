export function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = source === 'query' ? req.query : req.body;
      const parsed = schema.parse(data);
      if (source === 'query') req.query = parsed;
      else req.body = parsed;
      next();
    } catch (error) {
      res.status(400).json({
        error: {
          message: 'Invalid request payload',
          details: error.errors,
          code: 'VALIDATION_ERROR'
        }
      });
    }
  };
}
