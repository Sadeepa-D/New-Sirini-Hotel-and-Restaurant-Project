const RoleBasedMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.userData || !roles.includes(req.userData.Role)) {
      return res
        .status(403)
        .json({
          message: `Role (${req.userData.Role}) is not authorized to access this resource`,
        });
    }
    next();
  };
};

module.exports = RoleBasedMiddleware;
