import { NextPage } from "next"
import CreateDraft from "@/components/dream/CreateDraft"
const Page: NextPage = () => {
  return (
    <>
      <div className="py-6">
        <p>Dreams here</p>

        <CreateDraft
          close={() => {console.log("close")}}
        />
      </div>
    </>
  )
}

export default Page
