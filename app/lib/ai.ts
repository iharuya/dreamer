import { getRandomInt, sleep } from "./utils"
import fs from "fs"
/* eslint-disable */

// Ad hoc: すでに保存されているランダムファイル名を返す。確率的にエラーやNSFWになる。
export const mockRequestImage = async (
  prompt: string,
  parentFilename?: string
): Promise<{
  filename?: string
  nsfw?: boolean
  errorMessage?: string
}> => {
  const apiResult = await Promise.resolve("hoge")
  await sleep(3000)
  const files = fs
    .readdirSync("./public/seed-images")
    .filter((file) => file !== ".gitkeep")
  const randIdx = getRandomInt(0, files.length - 1)
  const rand = Math.random()
  if (rand < 0.95) {
    return {
      filename: files[randIdx],
      nsfw: false,
    }
  }
  if (rand < 0.99) {
    return {
      nsfw: true,
    }
  }
  return {
    errorMessage: "API request limit exceeded",
  }
}
