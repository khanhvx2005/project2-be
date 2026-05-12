import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import AccountUser from "../model/account-user.model";
const check = async (req: Request, res: Response) => {

  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: "error",
        message: "Token hợp lệ!"
      })
      return;
    }
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;
    const exitsAccount = await AccountUser.findOne({
      _id: id,
      email: email
    })
    if (!exitsAccount) {
      res.clearCookie("token")
      res.json({
        code: "error",
        message: "Token không hợp lệ!"
      })
      return;
    }
    const infoUser = {
      id: exitsAccount.id,
      fullName: exitsAccount.fullName,
      email: exitsAccount.email,

    }
    res.json({
      code: "success",
      message: "Token hợp lệ!",
      infoUser: infoUser
    })
  } catch (error) {
    res.clearCookie("token")
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
    })
  }

}
const logout = async (req: Request, res: Response) => {
  res.clearCookie("token")
  res.json({
    code: "success",
    message: "Đăng xuất thành công"
  })
}
export { check, logout }