const jwt = require("jsonwebtoken");

const creatJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachedCookiesToResponse = ({res, user}) => {
  const token = creatJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  res.status(201).json({ user });
}

module.exports = {
  creatJWT,
  isTokenValid,
  attachedCookiesToResponse,
};
