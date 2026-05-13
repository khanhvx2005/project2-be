import { Router } from "express";
import * as uploadController from '../controllers/upload.controller'
const multer = require('multer')
import * as uploadCloudHelper from '../helpers/uploadCloud.helper'
const upload = multer({ storage: uploadCloudHelper.storage })

const router = Router()
router.post('/image',
  upload.single('file'),
  uploadController.image)
export default router;