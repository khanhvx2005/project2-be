import { Router } from "express";
import * as companyController from '../controllers/company.controller'
import * as companyValidate from '../validates/company.validate'
const router = Router();
router.post('/register', companyValidate.register, companyController.register)
router.post('/login', companyValidate.login, companyController.login)
export default router;