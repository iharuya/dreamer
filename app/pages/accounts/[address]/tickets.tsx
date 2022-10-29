import { NextPageWithLayout } from "pages/_app"
import { ReactElement, useState } from "react"
import AccountLayout from "@/components/layouts/account/Layout"
import { useMyAccount } from "@/lib/hooks"
import useSWR from "swr"
import { ticketsFetcher } from "@/lib/fetchers"
import { LScale } from "@/components/common/Loading"
import Error from "next/error"
import TicketItem from "@/components/dream/ticket/Item"
import { Get as TicketsGet } from "@/api/dreams/tickets/index"
import { useBlockNumber, chain } from "wagmi"
import ManageTicketModal from "@/components/dream/ticket/ManageModal"

const Page: NextPageWithLayout = () => {
  const { data: myAccount } = useMyAccount()
  const {
    data: tickets,
    error: ticketsError,
    mutate: ticketsMutate,
  } = useSWR<TicketsGet>(
    myAccount ? ["tickets", myAccount.address] : null,
    ticketsFetcher
  )
  const { data: currentBlockNumber } = useBlockNumber({
    chainId: chain.polygonMumbai.id,
  })
  const [managingTicketId, setManagingTicketId] = useState<number | undefined>()

  if (tickets === undefined && !ticketsError)
    return <LScale message="チケットをロード中..." />
  if (tickets === undefined) {
    console.error(ticketsError)
    return <Error statusCode={ticketsError?.response?.status || 500} />
  }
  return (
    <>
      {tickets.length > 0 ? (
        <>
          <div className="flex flex-col space-y-4">
            {tickets.map((ticket) => (
              <TicketItem
                key={ticket.id}
                ticket={ticket}
                currentBlockNumber={currentBlockNumber}
                onClick={() => setManagingTicketId(ticket.id)}
              />
            ))}
          </div>
          {managingTicketId !== undefined && (
            <ManageTicketModal
              ticketId={managingTicketId}
              close={() => setManagingTicketId(undefined)}
              ticketsMutate={ticketsMutate}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-36 space-y-4 text-base-content/60">
          <span className="text-2xl font-bold">チケットを発行しよう</span>
          <span>
            ドラフト一覧からドラフトを選択するとチケットが発行できます
          </span>
        </div>
      )}
    </>
  )
}

Page.getLayout = (page: ReactElement) => {
  return <AccountLayout pageName="tickets">{page}</AccountLayout>
}

export default Page
