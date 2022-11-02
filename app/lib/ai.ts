import { getRandomInt, sleep } from "./utils"

/* eslint-disable */
export const mockRequestImage = async (
  prompt: string,
  parentFilename?: string
): Promise<{
  filename?: string
  nsfw?: boolean
  errorMessage?: string
}> => {
  const apiResult = await Promise.resolve("hoge")
  await sleep(5000)
  const rand = Math.random()
  if (rand < 0.8) {
    return {
      filename: `${getRandomInt(0, 32)}.jpg`,
      nsfw: false,
    }
  }
  if (rand < 0.95) {
    return {
      nsfw: true,
    }
  }
  return {
    errorMessage: "API request limit exceeded",
  }
}
