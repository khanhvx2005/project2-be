import { Router } from "express";
import * as userController from '../controllers/user.controller'
import * as userValidate from '../validates/user.validate'
const router = Router();
import * as authMiddleware from '../middlewares/auth.middleware'

import multer from 'multer';
import * as uploadCloudHelper from '../helpers/uploadCloud.helper'
const upload = multer({ storage: uploadCloudHelper.storage })

router.post('/register',
  userValidate.registerPost,
  userController.registerPost
)
router.post('/login',
  userController.loginPost
)
router.patch('/profile',
  upload.single('avatar'),
  // userValidate.profile,
  authMiddleware.verifyTokenUser,
  userController.profile)
export default router;