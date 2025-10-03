const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = header.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // For safety, make it explicit if server isn’t configured
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET not set' });
    }
    const payload = jwt.verify(token, secret);
    // Expect payload to have at least email; name is optional
    if (!payload?.email) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = { email: payload.email, name: payload.name || '' , id: payload.id || payload._id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
