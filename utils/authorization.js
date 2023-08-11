const Users = require("../models/users.model");

exports.isAdmin = async (req, res, next) => {
  const { _id } = req;

  if (_id) {
    const currentUser = await Users.findOne({ _id: _id });
    if (currentUser.role !== 0) {
      return res
        .status(401)
        .send({ message: "Access denied! Admin Resource!" });
    }

    return next();
  }

  return res.status(401).send({ message: "Access denied! Admin Resource!" });
};

exports.isPrivilegedUser = async (req, res, next) => {
  const { _id } = req;

  if (_id) {
    const currentUser = await Users.findOne({ _id: _id });
    if (currentUser.role !== 2) {
      return res
        .status(401)
        .send({ message: "Access denied! Privileged user resource!" });
    }

    return next();
  }

  return res
    .status(401)
    .send({ message: "Access denied! Privileged user Resource!" });
};

exports.notNormalUser = async (req, res, next) => {
  const { _id } = req;

  if (_id) {
    const currentUser = await Users.findOne({ _id: _id });
    if (currentUser.role === 1) {
      return res.status(401).send({ message: "Access denied!" });
    }

    return next();
  }

  return res.status(401).send({ message: "Access denied!" });
};
