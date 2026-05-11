import { Router } from "express";
import * as userController from '../controllers/user.controller'
import * as validates from '../validates/user.validate'
const router = Router();
router.post('/register',
  validates.registerPost,
  userController.registerPost
)
router.post('/login',
  userController.loginPost
)
export default router;