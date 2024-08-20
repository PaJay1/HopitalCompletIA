module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).send({ message: 'Forbidden: Admins only' });
  }
};
