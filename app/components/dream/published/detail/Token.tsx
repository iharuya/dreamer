import { BLOCK_TIME, EXPLORER_BASEURL, SYMBOL } from "@/constants/chain"
import { ADDRESS, PARAMS as P } from "@/constants/contracts/dreams"
import { FC } from "react"
import useSWR from "swr"
import { Get as TotalSupplyGet } from "@/api/blockchain/dreams/total-supply"
import { Get as BalanceOfGet } from "@/api/blockchain/dreams/balance-of"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import Image from "next/image"
import { formatEther } from "ethers/lib/utils"
import { useMyAccount } from "@/lib/hooks/useMyAccount"
import Tooltip from "@/components/common/Tooltip"
import BurnToken from "./BurnToken"

type Props = {
  tokenId: string
}
const Component: FC<Props> = ({ tokenId }) => {
  const { data: myAccount } = useMyAccount()
  const {
    data: totalSupply,
    error: totalSupplyError,
    mutate: totalSupplyMutate,
  } = useSWR<TotalSupplyGet>(
    `/api/blockchain/dreams/total-supply?tokenId=${tokenId}`,
    { refreshInterval: BLOCK_TIME * 1000 * 5 } // Once in 5 blocks
  )
  const {
    data: myBalance,
    error: myBalanceError,
    mutate: myBalanceMutate,
  } = useSWR<BalanceOfGet>(
    myAccount
      ? `/api/blockchain/dreams/balance-of?address=${myAccount.address}&tokenId=${tokenId}`
      : null
  )

  const reload = () => {
    totalSupplyMutate()
    myBalanceMutate()
  }

  if (totalSupplyError) {
    return (
      <Error
        code={totalSupplyError?.response?.status || 500}
        message="トークン情報の取得に失敗しました"
      />
    )
  }
  if (myBalanceError) {
    return (
      <Error
        code={myBalanceError?.response?.status || 500}
        message="保有数の取得に失敗しました"
      />
    )
  }

  const mintValue = (totalSupply: number) => {
    return P.alpha.add(P.delta).add(P.beta.mul(totalSupply))
  }

  const token_explorer_url = `${EXPLORER_BASEURL}/token/${ADDRESS}?a=${tokenId}`

  return (
    <div>
      <div className="w-full inline-flex justify-between">
        <h2 className="font-bold text-xl">ドリームトークン</h2>
        <a
          href={token_explorer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm"
        >
          <Image
            src="/polygon.svg"
            height={32}
            width={32}
            alt="エクスプローラー"
          />
        </a>
      </div>
      {totalSupply === undefined ? (
        <LScale message="トークンをロード中..." />
      ) : (
        <div className="py-2">
          <div className="mb-2 flex flex-col">
            <span className="badge badge-info mb-1">
              {totalSupply > 0
                ? `${totalSupply}枚が流通しています`
                : "トークンの流通はありません"}
            </span>
            <div className="inline-flex items-center">
              <span className="mr-1">リドリーム価格</span>
              <span className="mr-2">
                {formatEther(mintValue(totalSupply))} {SYMBOL}
              </span>
              <Tooltip
                message="このドリームをもとにドラフトを作成して投稿するための参考価格です。"
                position="bottom"
              />
            </div>
          </div>
        </div>
      )}
      {myAccount &&
        (myBalance === undefined ? (
          <LScale message="保有数をロード中..." />
        ) : (
          <div className="py-2">
            {myBalance > 0 ? (
              <div>
                <p className="mb-2">
                  <span className="badge badge-secondary">
                    {myBalance}枚保有しています
                  </span>
                </p>
                {totalSupply === undefined ? (
                  <LScale />
                ) : (
                  <BurnToken
                    tokenId={tokenId}
                    totalSupply={totalSupply}
                    myBalance={myBalance}
                    myAddress={myAccount.address}
                    onBurnt={reload}
                  />
                )}
              </div>
            ) : (
              <div>
                <p className="inline-flex items-center">
                  <span className="badge mr-2">
                    このトークンを保有していません
                  </span>
                  <Tooltip
                    message="トークンが買われるほど売却単価が上がります。"
                    position="bottom"
                  />
                </p>
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

export default Component
