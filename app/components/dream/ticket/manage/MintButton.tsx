import { FC, memo } from "react"
import { toast } from "react-toastify"
import { ethers } from "ethers"
import useSWR from "swr"
import { Get as MintValueGet } from "@/api/blockchain/dreams/mint-value"
import { ADDRESS } from "@/constants/contracts/dreams"
import ABI from "@/constants/contracts/abi/Dreams.json"
import { useContract, useSigner } from "wagmi"
import { Dreams } from "@/types/contracts"
import { SYMBOL } from "@/constants/chain"

type Props = {
  ticketId: number
  tokenId: number
  expiresAt: number
  signature: string
  onMinted: () => void
}
const Component: FC<Props> = ({
  ticketId,
  tokenId,
  expiresAt,
  signature,
  onMinted,
}) => {
  const { data: mintValue, error: mintValueError } = useSWR<MintValueGet>(
    `/api/blockchain/dreams/mint-value?tokenId=${tokenId}`
  )
  const { data: signer } = useSigner()
  const contract = useContract({
    address: ADDRESS,
    abi: ABI,
    signerOrProvider: signer,
  }) as Dreams | null

  const isMintable = mintValue !== undefined && contract !== null

  const handleMint = async () => {
    if (!isMintable) return
    const toastId = toast.info("トランザクションを送って下さい", {
      autoClose: false,
    })
    try {
      const tx = await contract.mint(ticketId, tokenId, expiresAt, signature, {
        value: mintValue,
      })
      toast.update(toastId, {
        render: "トークンをミント中...",
      })
      await tx.wait()
      onMinted()
      toast.update(toastId, {
        render: "トークンをミントしました！",
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      })
    } catch (err: any) {
      if (err.code === "ACTION_REJECTED") {
        toast.dismiss(toastId)
      } else {
        console.error(err)
        toast.update(toastId, {
          render: "ミントに失敗しました",
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        })
      }
    }
  }

  if (mintValue === undefined && !mintValueError)
    return <span>ロード中...</span>
  if (mintValue === undefined) {
    console.error(mintValueError)
    return <span className="text-error">エラー</span>
  }

  const mintValueHuman = ethers.utils.formatEther(mintValue)
  return (
    <>
      <button
        className="btn btn-primary normal-case"
        onClick={handleMint}
        disabled={!isMintable}
      >
        トークンをミント（{mintValueHuman} {SYMBOL}）
      </button>
    </>
  )
}

export default memo(Component)
