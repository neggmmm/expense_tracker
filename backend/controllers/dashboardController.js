exports.dashboard = (req, res) => {
    res.json({
      message: `Welcome to your dashboard, ${req.user.name}!`,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    });
  };