import { NextApiRequest, NextApiResponse } from "next";
import { z, ZodSchema } from "zod";

export function withZod<T extends ZodSchema>(
  schema: T,
  next: (
    // NextApiRequest に定義されている曖昧な "query" | "body" 定義を除去し、
    // z.infer でスキーマの型定義を抽出する
    req: Omit<NextApiRequest, "query" | "body"> & z.infer<T>,
    res: NextApiResponse
  ) => unknown | Promise<unknown>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const parsed = schema.safeParse(req);
    if (!parsed.success) {
      // 共通のバリデーションエラーレスポンスとして処理
      res.status(400).json({
        message: "Bad Request",
        issues: JSON.parse(parsed.error.message),
      });
      return;
    }
    return next(req, res);
  };
}