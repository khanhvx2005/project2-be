import { Request, Response } from "express";
import AccountCompany from "../model/account-company.model";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { AccountRequest } from "../interfaces/request.interface";
import Job from "../model/job.model";
import City from "../model/city.model";
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

const listJob = async (req: AccountRequest, res: Response) => {
  const find = {
    companyId: req.account.id
  }
  // Pagination
  const totalRecords = await Job.countDocuments(find);
  const limitItems = 4;

  const totalPage = Math.ceil(totalRecords / limitItems)
  let currentPage = 1;
  if (req.query.page) {
    const page = req.query.page as any;
    if (page > 0) {
      currentPage = parseInt(page)
    }
  }
  if (currentPage > totalPage && totalPage > 0) {
    currentPage = totalPage
  }

  const skip = (currentPage - 1) * limitItems;
  // End Pagination
  const jobList = await Job
    .find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)
  const city = await City.findOne({
    _id: req.account.city
  })
  const dataFinal = [];
  for (const job of jobList) {
    dataFinal.push({
      id: job.id,
      companyLogo: req.account.logo,
      title: job.title,
      companyName: req.account.companyName,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      position: job.position,
      workingForm: job.workingForm,
      companyCity: city?.name,
      technologies: job.technologies

    })

  }

  res.json({
    code: "success",
    jobs: dataFinal,
    totalPage: totalPage
  })
}

const editJob = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;
    const jobDetail = await Job.findOne({
      _id: id,
      companyId: req.account.id
    })
    if (!jobDetail) {
      res.json({
        code: "error",
        message: "id không hợp lệ"
      })
      return;
    }

    res.json({
      code: "success",
      message: "Thành công",
      jobDetail: jobDetail
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "id không hợp lệ"
    })
  }
}

const editJobPatch = async (req: AccountRequest, res: Response) => {
  const id = req.params.id;
  req.body.companyId = req.account.id;
  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.images = [];
  if (req.files) {
    for (const item of req.files as any[]) {
      req.body.images.push(item.path);
    }
  }
  req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
  await Job.updateOne({
    _id: id,
    companyId: req.body.companyId
  }, req.body)

  res.json({
    code: "success",
    message: "Cập nhập thành công"
  })
}

const deleteJobDel = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;
    const jobDetail = await Job.findOne({
      _id: id,
      companyId: req.account.id
    })
    if (!jobDetail) {
      res.json({
        code: "error",
        message: "id không hợp lệ"
      })
      return;
    }
    await Job.deleteOne({
      _id: id
    })
    res.json({
      code: "success",
      message: "Đã xóa"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "id không hợp lệ"
    })
  }

}
export { register, login, profile, createJob, listJob, editJob, editJobPatch, deleteJobDel }