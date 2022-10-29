import { Account } from "@prisma/client"
import { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import useSWR from "swr"

export const useMyAccount = () => {
  const { data: session } = useSession()
  const { data, error, mutate } = useSWR<Account, AxiosError>(
    session?.address ? `/api/accounts/${session.address}` : null
  )
  return {
    data: data,
    error: error,
    mutate: mutate,
  }
}
