import {Router} from "express"
import { registerUsercontroller,loginUsercontroller,logoutUsercontroller,getMecontroller } from "../controllers/auth.controller.js";
import authuser from "../middlewares/auth.middleware.js";
const authRouter=Router();

authRouter.post("/register",registerUsercontroller)
authRouter.post("/login",loginUsercontroller)
authRouter.get("/logout",logoutUsercontroller)
authRouter.get("/getMe",authuser,getMecontroller)

export default authRouter;
