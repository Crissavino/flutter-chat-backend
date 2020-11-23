/* 

    path: /api/auth

*/
const {Router} = require("express");
const {check} = require("express-validator");
const {
    crearUsuario,
    loginUsuario,
    renewToken,
    create
} = require("../controllers/authController");
const {validarCampos} = require("../middlewares/validar-campos");
const {validarJWT} = require("../middlewares/validar-jwt");
const router = Router();

router.post(
    "/new",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("email", "El email es obligatorio").not().isEmpty(),
        check("email", "Debe ser un correo valido").isEmail(),
        check("password", "La password es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    crearUsuario
);

router.post(
    "/create",
    [
        check("fullName", "El nombre es obligatorio").not().isEmpty(),
        check("email", "El email es obligatorio").not().isEmpty(),
        check("email", "Debe ser un correo valido").isEmail(),
        check("password", "La password es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    create
);

router.post(
    "/",
    [
        check("email", "El email es obligatorio").not().isEmpty(),
        check("email", "Debe ser un correo valido").isEmail(),
        check("password", "La password es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    loginUsuario
);

router.get("/renewToken", validarJWT, renewToken);

module.exports = router;
