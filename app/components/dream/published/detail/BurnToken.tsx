import { SYMBOL } from "@/constants/chain"
import { ADDRESS, PARAMS as P } from "@/constants/contracts/dreams"
import { ChangeEvent, FC, useState } from "react"
import { formatEther } from "ethers/lib/utils"
import { useContract, useSigner } from "wagmi"
import ABI from "@/constants/contracts/abi/Dreams.json"
import { Dreams } from "@/types/contracts"
import { toast } from "react-toastify"

type Props = {
  tokenId: string
  totalSupply: number
  myBalance: number
  myAddress: string
  onBurnt: () => void
}
const Component: FC<Props> = ({
  tokenId,
  totalSupply,
  myBalance,
  myAddress,
  onBurnt,
}) => {
  const [burnAmount, setBurnAmount] = useState<number>(1)
  const { data: signer } = useSigner()
  const contract = useContract({
    address: ADDRESS,
    abi: ABI,
    signerOrProvider: signer,
  }) as Dreams | null
  const [isTransacting, setIsTransacting] = useState<boolean>(false)

  const handleBurn = async () => {
    if (!contract) return
    setIsTransacting(true)
    const toastId = toast.info("トランザクションを送って下さい", {
      autoClose: false,
    })
    try {
      const tx = await contract.burn(myAddress, tokenId, burnAmount)
      toast.update(toastId, {
        render: "トークンを売却中...",
      })
      await tx.wait()
      onBurnt()
      toast.update(toastId, {
        render: "トークンを売却しました！",
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      })
    } catch (err: any) {
      if (err.code === "ACTION_REJECTED") {
        toast.dismiss(toastId)
      } else {
        console.error(err)
        toast.update(toastId, {
          render: "売却に失敗しました",
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        })
      }
    }
    setIsTransacting(false)
  }

  const burnValue = (totalSupply: number, amount: number) => {
    const b = totalSupply
    const a = b + 1 - amount
    return P.alpha
      .mul(2)
      .add(P.beta.mul(a + b - 2))
      .mul(b - a + 1)
      .div(2)
  }

  return (
    <div>
      <div className="form-control">
        <label className="input-group input-group-md">
          <input
            type="number"
            min={1}
            max={myBalance}
            value={burnAmount}
            placeholder="1"
            className="input input-bordered"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setBurnAmount(parseInt(e.target.value))
            }
          />
          <span>枚</span>
          <button
            className="btn btn-secondary"
            onClick={handleBurn}
            disabled={isTransacting}
          >
            売却（{formatEther(burnValue(totalSupply, burnAmount))} {SYMBOL}）
          </button>
        </label>
      </div>
    </div>
  )
}

export default Component
