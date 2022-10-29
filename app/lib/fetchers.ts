import axios from "axios"

export const defaultFetcher = (url: string) =>
  axios.get(url).then((res) => res.data)

export const draftsFetcher = (keyName: string, address: string) => {
  console.assert(
    keyName === "drafts",
    "keyName must be 'drafts' to make a global key."
  )
  return axios
    .get("/api/dreams/drafts", { params: { dreamerAddress: address } })
    .then((res) => res.data)
}
