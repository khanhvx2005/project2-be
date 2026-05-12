import { Request, Response } from "express";
import AccountCompany from "../model/account-company.model";
import bcrypt from "bcryptjs";
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
export { register }