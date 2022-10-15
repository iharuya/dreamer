import { useSession, signIn, signOut } from "next-auth/react"
import type { FC } from "react"

const Component: FC = () => {
  const { data: session } = useSession()
  if (session) {
    console.log(session)
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
export default Component