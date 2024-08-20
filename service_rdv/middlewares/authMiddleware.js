const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const response = await axios.get(`http://localhost:5000/users/verifyToken`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    req.user = response.data.user;
    next();
  } catch (error) {
    console.error(`Auth error: ${error.message}`);
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};





