import { FC } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UpdateAccount } from "@/schema/accounts"
import { KeyedMutator } from "swr"
import { toast } from "react-toastify"
import axios from "axios"
import { Account } from "@prisma/client"
import clsx from "clsx"

const schema = UpdateAccount.shape.body
type Schema = z.infer<typeof schema>

type Props = {
  account: Account
  close: () => void
  mutate: KeyedMutator<Account>
}
const Component: FC<Props> = ({ account, close, mutate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const update = async (data: Schema) => {
    axios
      .patch(`/api/accounts/${account.address}`, data)
      .then(() => {
        mutate()
        close()
      })
      .catch((e) => {
        console.error(e)
        toast.error("更新に失敗しました")
      })
  }
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-2xl mb-4">アカウント設定</h3>
        <form onSubmit={handleSubmit(update)}>
          <div className="form-control">
            <div className="mb-4">
              <label className="label">
                <span className="label-text">名前</span>
              </label>
              <input
                type="text"
                placeholder="名前を入力"
                className={clsx(
                  "input w-full input-bordered",
                  formErrors.name?.message && "input-error"
                )}
                defaultValue={account.name || ""}
                {...register("name")}
              />
              {formErrors.name?.message && (
                <label className="label">
                  <span className="label-text text-error">
                    {formErrors.name?.message}
                  </span>
                </label>
              )}
            </div>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={close}>
              とじる
            </button>
            <button type="submit" className="btn btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Component
