/* eslint-disable */
export const getBlockNumber = async () => {
  // ad hoc
  return await Promise.resolve(40000000)
}

export const isDreamMinted = async (ticketId: number): Promise<boolean> => {
  // ad hoc
  const events = await Promise.resolve([
    {
      to: "0x",
      tokenId: "123",
      ticketId: "246",
    },
  ])
  return events.length === 1
}
