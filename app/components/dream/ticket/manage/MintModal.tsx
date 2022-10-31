import { FC } from "react"
import { toast } from "react-toastify"
import { ethers } from "ethers"
import useSWR from "swr"
import { Get as MintValueGet } from "@/api/blockchain/dreams/mint-value"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"

type Props = {
  ticketId: number
  tokenId: number
  expiresAt: number
  signature: string
  onClose: () => void
  onMint: () => void
}
const Component: FC<Props> = ({
  ticketId,
  tokenId,
  expiresAt,
  signature,
  onClose,
  onMint,
}) => {
  const { data: mintValue, error: mintValueError } = useSWR<MintValueGet>(
    `/api/blockchain/dreams/mint-value?tokenId=${tokenId}`
  )

  if (mintValue === undefined && !mintValueError)
    return <LScale message="ロード中" modal />
  if (mintValue === undefined) {
    console.error(mintValueError)
    return (
      <Error
        code={mintValueError?.response?.status || 500}
        message="ミント価格の取得に失敗しました"
        modal
        onClose={close}
      />
    )
  }

  const mintValueHuman = ethers.utils.formatEther(mintValue)
  console.log(mintValueHuman)
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-2xl mb-4">トークンを発行</h3>
        <div className="alert">
          <div>
            <span>ドリームトークンを発行してドリームしよう！</span>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary">
              トークン発行
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Component
