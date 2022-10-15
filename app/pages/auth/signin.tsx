import type { NextPage } from "next"
import { useState } from "react"
import type { FormEventHandler } from "react"
import { signIn } from "next-auth/react"

const SignIn: NextPage = () => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" })
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false
    })
    console.log(res)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl">Login</h1>
        <input
          type="email"
          value={userInfo.email}
          placeholder="sample@gmail.com"
        />
        <input
          type="password"
          value={userInfo.password}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, password: target.value })
          }
        />
      </form>
    </div>
  )
}

export default SignIn
