export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      issues: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  req.body = result.data;
  next();
};

export const errorHandler = (err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
};
