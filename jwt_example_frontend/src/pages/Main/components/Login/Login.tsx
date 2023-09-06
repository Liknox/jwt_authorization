import { FormEvent, useRef } from "react"
import { useAppDispatch } from "../../../../store"
import { loginUser } from "../../../../store/auth/actionCreators"

const Login = () => {
	const dispatch = useAppDispatch()

	const loginData = useRef({ login: "", password: "" })

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		dispatch(loginUser({ login: loginData.current.login, password: loginData.current.password }))
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="login">Login:</label>
					<input name="login" type="text" onChange={e => (loginData.current.login = e.target.value)} />
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input name="password" type="password" onChange={e => (loginData.current.password = e.target.value)} />
				</div>
				<button>Submit</button>
			</form>
		</div>
	)
}

export default Login
