import { Request, Response } from "express";
import AccountCompany from "../model/account-company.model";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { AccountRequest } from "../interfaces/request.interface";
import Job from "../model/job.model";
const register = async (req: Request, res: Response) => {
  const { companyName, email, password } = req.body;
  const exitsAccount = await AccountCompany.findOne({
    email: email
  })
  if (exitsAccount) {
    res.json({
      code: "success",
      message: "Email đã tồn tại trong hệ thống!"
    })
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, salt);
  const newAccountCompany = new AccountCompany({
    companyName: companyName,
    email: email,
    password: passwordHashed
  })
  await newAccountCompany.save();
  res.json({
    code: "success",
    message: "Đăng ký thành công!"
  })
}

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const exitsAccount = await AccountCompany.findOne({
    email: email
  })
  if (!exitsAccount) {
    res.json({
      code: "error",
      message: "Email không hợp lệ!"
    })
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, `${exitsAccount.password}`);
  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Sai mật khẩu"
    })
    return;
  }
  const token = jwt.sign(
    {
      id: exitsAccount.id,
      email: exitsAccount.email
    },
    `${process.env.JWT_SECRET}`,
    { expiresIn: '1d' }
  );
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: 'lax'
  })

  res.json({
    code: "success",
    message: "Đăng nhập thành công"
  })
}

const profile = async (req: AccountRequest, res: Response) => {

  if (req.file) {
    req.body.logo = req.file.path;
  } else {
    delete req.body.logo;
  }
  await AccountCompany.updateOne({
    _id: req.account.id
  }, req.body)
  res.json({
    code: "success",
    message: "Cập nhập thành công"
  })
}

const createJob = async (req: AccountRequest, res: Response) => {
  req.body.companyId = req.account.id;
  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.images = [];
  if (req.files) {
    for (const item of req.files as any[]) {
      req.body.images.push(item.path)
    }
  }
  req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
  const newJob = new Job(req.body)
  await newJob.save()
  res.json({
    code: "success",
    message: "Tạo công việc thành công"
  })
}

export { register, login, profile, createJob }