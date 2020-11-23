/* 

    path: /api/users

*/
const { Router } = require("express");
const { check } = require("express-validator");
const { getUsuarios, getAllUsers } = require("../controllers/usuariosController");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getUsuarios);
router.get("/getAllUsers", validarJWT, getAllUsers);

module.exports = router;
