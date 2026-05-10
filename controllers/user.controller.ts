import { Request, Response } from "express"
import AccountUser from "../model/account-user.model";
import bcrypt from "bcryptjs";
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
export { registerPost }