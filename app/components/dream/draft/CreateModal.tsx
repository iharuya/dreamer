import { FC } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createDraft as createDraftSchema } from "@/schema/dreams"
import { toast } from "react-toastify"
import axios from "axios"
import clsx from "clsx"
import { useSWRConfig } from "swr"
// Todo: Integrate "redream"

const schema = createDraftSchema.shape.body.pick({
  title: true,
  caption: true,
  prompt: true,
})
type Schema = z.infer<typeof schema>

type Props = {
  dreamerAddress: string
  close: () => void
}
const Component: FC<Props> = ({ dreamerAddress, close }) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })
  const { mutate } = useSWRConfig()

  const create = async (data: Schema) => {
    const body = {
      ...data,
      dreamerAddress,
    }
    axios
      .post("/api/dreams/drafts", body)
      .then(() => {
        toast.info("ドラフトを作成しました")
        mutate(["drafts", dreamerAddress])
        close()
      })
      .catch((e) => {
        console.error(e)
        toast.error("ドラフト作成失敗")
      })
  }

  return (
    <div className="modal modal-open modal-bottom md:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-2xl mb-4">新規ドラフト</h3>
        <form onSubmit={handleSubmit(create)}>
          <div className="form-control">
            <div className="mb-4">
              <label className="label">
                <span className="label-text">タイトル</span>
              </label>
              <input
                type="text"
                placeholder="1000年後の富士山"
                className={clsx(
                  "input input-bordered w-full",
                  formErrors.title?.message && "input-error"
                )}
                {...register("title")}
              ></input>
              {formErrors.title?.message && (
                <label className="label">
                  <span className="label-text text-error">
                    {formErrors.title?.message}
                  </span>
                </label>
              )}
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">プロンプト</span>
              </label>
              <textarea
                placeholder="View of Mt. Fuji in the distant future"
                className={clsx(
                  "textarea textarea-bordered w-full",
                  formErrors.prompt?.message && "textarea-error"
                )}
                {...register("prompt")}
              ></textarea>
              {formErrors.prompt?.message && (
                <label className="label">
                  <span className="label-text text-error">
                    {formErrors.prompt?.message}
                  </span>
                </label>
              )}
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">キャプション（任意）</span>
              </label>
              <textarea
                className={clsx(
                  "textarea textarea-bordered w-full",
                  formErrors.caption?.message && "textarea-error"
                )}
                {...register("caption")}
              ></textarea>
              {formErrors.caption?.message && (
                <label className="label">
                  <span className="label-text text-error">
                    {formErrors.caption?.message}
                  </span>
                </label>
              )}
            </div>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={close}>
              キャンセル
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
