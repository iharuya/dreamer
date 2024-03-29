import { NextApiRequest, NextApiResponse } from "next"
import { z, ZodSchema } from "zod"
import { getAddress, isAddress } from "ethers/lib/utils"
import { isBigNumberish } from "./utils"

export function withZod<T extends ZodSchema>(
  schema: T,
  next: (
    /* eslint-disable no-unused-vars */
    req: Omit<NextApiRequest, "query" | "body"> & z.infer<T>,
    res: NextApiResponse
    /* eslint-enable */
  ) => unknown | Promise<unknown>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const parsed = schema.safeParse(req)
    if (!parsed.success) {
      res.status(400).json({
        message: "Bad Request",
        issues: JSON.parse(parsed.error.message),
      })
      return
    }
    req.query = parsed.data.query
    req.body = parsed.data.body
    return next(req, res)
  }
}

export const ethAddress = z.string().refine((val) => {
  const low = val.toLowerCase()
  return isAddress(low) && getAddress(low) === val
}, "Invalid ethereum address")

export const bigNumberString = z.string().refine((val) => {
  return isBigNumberish(val)
}, "Invalid string")
