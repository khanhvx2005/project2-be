import { Router } from "express";
import * as companyController from '../controllers/company.controller'
import * as companyValidate from '../validates/company.validate'
import * as authMiddleware from '../middlewares/auth.middleware'
const multer = require('multer')
import * as uploadCloudHelper from '../helpers/uploadCloud.helper'
const router = Router();
const upload = multer({ storage: uploadCloudHelper.storage })

router.post('/register', companyValidate.register, companyController.register)

router.post('/login', companyValidate.login, companyController.login)

router.patch('/profile',
  upload.single('logo'),
  authMiddleware.verifyTokenCompany,
  companyController.profile)

router.post('/job/create',
  upload.array('images', 12),
  authMiddleware.verifyTokenCompany,
  companyController.createJob)

router.get('/job/list',
  authMiddleware.verifyTokenCompany,
  companyController.listJob
)
export default router;