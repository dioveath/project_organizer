import { Router } from "express";
import Express from "express";

import * as AuthController from "../../controllers/auth_controller.js";
import checkUser from "../middlewares/checkUser.js";

const router = new Router();

router.use(Express.urlencoded({ extended: true }));
router.use(Express.json());

router.get("/login", checkUser, AuthController.getLogin);
router.post("/login", AuthController.postLogin);

router.get("/register", AuthController.getRegister);
router.post("/register", AuthController.postRegister);

router.get("/logout", AuthController.getLogout);

export default router;
