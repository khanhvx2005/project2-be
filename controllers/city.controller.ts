import { Request, Response } from "express";
import City from "../model/city.model";

const list = async (req: Request, res: Response) => {
  const cityList = await City.find({})
  res.json({
    code: "success",
    cityList: cityList
  })
}
export { list }