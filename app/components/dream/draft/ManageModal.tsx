import { FC, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UpdateDraft } from "@/schema/dreams"
import { toast } from "react-toastify"
import axios from "axios"
import clsx from "clsx"
import useSWR, { KeyedMutator } from "swr"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import DeleteModal from "@/components/common/DeleteModal"
import { MdDelete } from "react-icons/md"
import IssueTicketModal from "@/components/dream/ticket/IssueModal"
import { Get as DraftGet } from "@/api/dreams/drafts/[id]"
import { Get as DraftsGet } from "@/api/dreams/drafts/index"
// Todo: redream

const schema = UpdateDraft.shape.body.pick({
  title: true,
  caption: true,
  prompt: true,
})
type Schema = z.infer<typeof schema>

type Props = {
  draftId: number
  close: () => void
  draftsMutate: KeyedMutator<DraftsGet>
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
  const { data: draft, error: draftError } = useSWR<DraftGet>(
    `/api/dreams/drafts/${draftId}`
  )
  if (draft === undefined && !draftError)
    return <LScale message="ドラフトをロード中..." modal />
  if (draft === undefined) {
    console.error(draftError)
    return (
      <Error
        code={draftError?.response?.status || 500}
        message="ドラフトの取得に失敗しました"
        modal
        onClose={close}
      />
    )
  }

  const handleUpdate = async (data: Schema) => {
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

  const handleDelete = async () => {
    axios
      .delete(`/api/dreams/drafts/${draft.id}`)
      .then(() => {
        draftsMutate()
        close()
      })
      .catch((e) => {
        console.error(e)
        toast.error("ドラフト削除失敗")
      })
  }

  return (
    <>
      <div className="modal modal-open modal-bottom md:modal-middle">
        <div className="modal-box">
          <div className="flex mb-4 items-center">
            <h3 className="font-bold text-2xl">ドラフト</h3>
            <button
              className="btn btn-primary ml-auto"
              onClick={() => setIsIssueTicketOpen(true)}
            >
              チケット発行
            </button>
          </div>
          <form onSubmit={handleSubmit(handleUpdate)}>
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
                とじる
              </button>
              <button type="submit" className="btn btn-primary">
                保存
              </button>
            </div>
          </form>
        </div>
      </div>

      {isIssueTicketOpen && (
        <IssueTicketModal
          senderAddress={draft.dreamerAddress}
          draftId={draft.id}
          onClose={() => setIsIssueTicketOpen(false)}
          onIssue={() => {
            draftsMutate()
            close()
          }}
        />
      )}

      {isDeleteOpen && (
        <DeleteModal
          title="ドラフトを削除しますか？"
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={() => handleDelete()}
        />
      )}
    </>
  )
}

export default Component
