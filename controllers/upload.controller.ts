import { Request, Response } from "express";

export const image = async (req: Request, res: Response) => {
  res.json({
    location: req?.file?.path
  })
}