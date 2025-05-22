module.exports = (req, res, next) => {
    const csrfTokenFromCookie = req.cookies['csrf_token'];
    const csrfTokenFromHeader = req.headers['x-csrf-token'];
  
    if (!csrfTokenFromCookie || csrfTokenFromCookie !== csrfTokenFromHeader) {
      return res.status(403).json({ error: 'CSRF validation failed' });
    }
  
    next();
  };
  