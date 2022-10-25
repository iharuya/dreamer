// ad hoc. Add "parent image" for redream
/* eslint-disable */
export const requestImage = async (
  prompt: string
): Promise<{
  url?: string
  nsfw?: boolean
  error?: any
}> => {
  let apiResult
  try {
    apiResult = await Promise.resolve(["https://example.com"])
    const nsfw = apiResult[0].length === 0
    const url = apiResult[0]
    return {
      url,
      nsfw,
    }
  } catch (err) {
    return { error: err }
  }
}
