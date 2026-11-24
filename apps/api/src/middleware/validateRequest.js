export function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = source === 'query' ? req.query : req.body;
      const parsed = schema.parse(data);
      if (source === 'query') req.query = parsed;
      else req.body = parsed;
      next();
    } catch (error) {
      const issues = error.issues || error.errors || [];
      const firstMessage = issues[0]?.message || 'Invalid request payload';
      res.status(400).json({
        error: {
          message: firstMessage,
          details: issues,
          code: 'VALIDATION_ERROR'
        }
      });
    }
  };
}
