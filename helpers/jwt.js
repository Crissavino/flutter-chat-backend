const jwt = require("jsonwebtoken");

const generarJWT = (uuid) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uuid,
    };

    jwt.sign(
      payload,
      process.env.JWT_KEY,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          // no se pudo crear el token
          reject("No se pudo generar el JSW");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const comprobarJWT = (token = "") => {
  try {
    const { uuid } = jwt.verify(token, process.env.JWT_KEY);
    return [true, uuid];
    next();
  } catch (error) {
    return [false, null];
  }
};

module.exports = {
  generarJWT,
  comprobarJWT,
};
