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

module.exports = {
  generarJWT,
};
