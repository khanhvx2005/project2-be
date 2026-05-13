import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import AccountUser from "../model/account-user.model";
import AccountCompany from "../model/account-company.model";
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
    const exitsAccountUser = await AccountUser.findOne({
      _id: id,
      email: email
    })
    if (exitsAccountUser) {
      const infoUser = {
        id: exitsAccountUser.id,
        fullName: exitsAccountUser.fullName,
        email: exitsAccountUser.email,
        avatar: exitsAccountUser.avatar,
        phone: exitsAccountUser.phone
      }
      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoUser: infoUser
      })
      return;
    }
    const exitsAccountCompany = await AccountCompany.findOne({
      _id: id,
      email: email
    })
    if (exitsAccountCompany) {
      const infoCompany = {
        id: exitsAccountCompany.id,
        companyName: exitsAccountCompany.companyName,
        email: exitsAccountCompany.email,
        city: exitsAccountCompany.city,
        address: exitsAccountCompany.address,
        companyModel: exitsAccountCompany.companyModel,
        companyEmployees: exitsAccountCompany.companyEmployees,
        workingTime: exitsAccountCompany.workingTime,
        workOvertime: exitsAccountCompany.workOvertime,
        description: exitsAccountCompany.description,
        phone: exitsAccountCompany.phone,
        logo: exitsAccountCompany.logo

      }
      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoCompany: infoCompany
      })
      return;
    }
    if (!exitsAccountUser && !exitsAccountCompany) {
      res.clearCookie("token")
      res.json({
        code: "error",
        message: "Token không hợp lệ!"
      })
    }


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