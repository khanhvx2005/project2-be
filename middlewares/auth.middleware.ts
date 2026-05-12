import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import AccountCompany from "../model/account-company.model";
import AccountUser from "../model/account-user.model";
import { AccountRequest } from "../interfaces/request.interface";

const verifyTokenUser = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.json({
        code: "error",
        message: "Token không hợp lệ!"
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
    req.account = exitsAccount;
    next()
  } catch (error) {
    res.clearCookie("token")
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
    })
  }

}
export { verifyTokenUser }