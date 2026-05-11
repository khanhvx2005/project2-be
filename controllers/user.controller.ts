import { Request, Response } from "express"
import AccountUser from "../model/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const registerPost = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  const exitsAccount = await AccountUser.findOne({
    email: email
  })
  if (exitsAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    })
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const passWordHashed = await bcrypt.hash(password, salt);
  const newAccountUser = new AccountUser({
    fullName: fullName,
    email: email,
    password: passWordHashed
  })
  await newAccountUser.save()
  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công"
  })
}
const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const exitsAccount = await AccountUser.findOne({
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
      message: "Sai mật khẩu!"
    })
    return;
  }

  const token = jwt.sign({
    id: exitsAccount.id,
    email: exitsAccount.email,
  },
    `${process.env.JWT_SECRET}`,
    { expiresIn: '1d' }
  );
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax", // Cho phép gửi cookie giữa các domain
    secure: process.env.SECURE === "production" ? true : false
  })
  res.json({
    code: "success",
    message: "Đăng nhập thành công",
    token: token
  })
}
export { registerPost, loginPost }