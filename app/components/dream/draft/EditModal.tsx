import { FC, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateDraft as updateDraftSchema } from "@/schema/dreams"
import { toast } from "react-toastify"
import axios from "axios"
import clsx from "clsx"
import useSWR, { KeyedMutator } from "swr"
import { Dream } from "@prisma/client"
import { LScale } from "@/components/common/Loading"
import Error from "next/error"
import { MdDelete } from "react-icons/md"
import DeleteDraftModal from "@/components/dream/draft/DeleteModal"
import IssueTicketModal from "@/components/dream/ticket/IssueModal"

// Todo: redream

const schema = updateDraftSchema.shape.body.pick({
  title: true,
  caption: true,
  prompt: true,
})
type Schema = z.infer<typeof schema>

type Props = {
  draftId: number
  close: () => void
  draftsMutate: KeyedMutator<Dream[]>
}
const Component: FC<Props> = ({ draftId, close, draftsMutate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [isIssueTicketOpen, setIsIssueTicketOpen] = useState<boolean>(false)
  const { data: draft, error: draftError } = useSWR<Dream>(
    `/api/dreams/drafts/${draftId}`
  )
  if (draft === undefined && !draftError)
    return <LScale message="ドラフトをロード中..." />
  if (draft === undefined) {
    console.error(draftError)
    return <Error statusCode={draftError?.response?.status || 500} />
  }

  const update = async (data: Schema) => {
    axios
      .patch(`/api/dreams/drafts/${draftId}`, data)
      .then(() => {
        draftsMutate() // Should be optimistic and updated only this draft
        close()
      })
      .catch((e) => {
        console.error(e)
        toast.error("ドラフト更新失敗")
      })
  }

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <div className="flex mb-4 items-center">
            <h3 className="font-bold text-2xl">ドラフト編集</h3>
            <button
              className="btn btn-primary ml-auto"
              onClick={() => setIsIssueTicketOpen(true)}
            >
              チケット発行
            </button>
          </div>
          <form onSubmit={handleSubmit(update)}>
            <div className="form-control">
              <div className="mb-4">
                <label className="label">
                  <span className="label-text">タイトル</span>
                </label>
                <input
                  type="text"
                  placeholder="1000年後の富士山"
                  defaultValue={draft.title}
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
                  defaultValue={draft.prompt}
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
                  defaultValue={draft.caption || undefined}
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
              <button
                type="button"
                className="btn btn-square btn-error mr-auto"
                onClick={() => setIsDeleteOpen(true)}
              >
                <MdDelete className="text-3xl" />
              </button>
              <button type="button" className="btn" onClick={close}>
                キャンセル
              </button>
              <button type="submit" className="btn btn-primary">
                更新
              </button>
            </div>
          </form>
        </div>
      </div>

      {isIssueTicketOpen && (
        <IssueTicketModal
          senderAddress={draft.dreamerAddress}
          draftId={draft.id}
          close={() => setIsIssueTicketOpen(false)}
          onIssue={() => {
            draftsMutate()
            close()
          }}
        />
      )}

      {isDeleteOpen && (
        <DeleteDraftModal
          draft={draft}
          close={() => setIsDeleteOpen(false)}
          onDelete={() => {
            draftsMutate()
            close()
          }}
        />
      )}
    </>
  )
}

export default Component
