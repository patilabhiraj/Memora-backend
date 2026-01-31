const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  //   1️⃣ get auth header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      message: 'No token, authorization denied',
    });
  }
 
  //   2️⃣ extract token
  const token = authHeader.split(' ')[1];

  try {
    // 3️⃣ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ attach user id to request
    req.userId = decoded.userId;

    next(); // allow request to continue
  } catch (error) {
    return res.status(401).json({
      message: 'Token is not valid',
    });
  }
};

module.exports = authMiddleware;
