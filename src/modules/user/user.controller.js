import { Router } from "express";
import * as userService from "./user.service.js"
import { authenticate } from "../../middlewares/auth.middleware.js";
const router = Router()
router.post("/signup" , userService.signup )
router.post("/login" , userService.login )
router.patch("/" , authenticate , userService.update )
router.delete("/" , authenticate , userService.deleteUser )
router.get("/" , authenticate , userService.getUser)
export default router