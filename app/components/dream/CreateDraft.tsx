import { FC } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createDraft as createDraftSchema } from "@/schema/dreams"
import { toast } from "react-toastify"
import axios from "axios"
import clsx from "clsx"
import { Account } from "@prisma/client"

// Add /api/dreams/draft
// Todo: Add or integrate "Edit draft"
// Todo: Integrate "redream"

const schema = createDraftSchema.shape.body
type Schema = z.infer<typeof schema>

type Props = {
  close: () => void
}
const Component: FC<Props> = ({ close }) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const create = async (data: Schema) => {
    axios
      .post("/api/dreams", data)
      .then(() => {
        toast.info("ドラフトを作成しました")
        close()
      })
      .catch((e) => {
        console.error(e)
        toast.error("ドラフト作成失敗")
      })
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-2xl mb-4">新規ドラフト</h3>
        <form onSubmit={handleSubmit(create)}>
          <div className="form-control">
            <textarea 
              placeholder="将来何してる？"
              className={clsx("textarea", formErrors.body?.message && "textarea-error")}
              {...register("body")}
            ></textarea>
            {formErrors.body?.message && (
              <label className="label">
                <span className="label-text text-error">
                  {formErrors.body?.message}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text">プロンプト</span>
            </label>
            <textarea 
              placeholder="A horse on the moon"
              className={clsx("textarea", formErrors.prompt?.message && "textarea-error")}
              {...register("body")}
            ></textarea>
            {formErrors.prompt?.message && (
              <label className="label">
                <span className="label-text text-error">
                  {formErrors.prompt?.message}
                </span>
              </label>
            )}
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={close}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary">
              Dream
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Component