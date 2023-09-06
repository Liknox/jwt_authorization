import { Dispatch } from "@reduxjs/toolkit"
import api from "../../api"
import { ILoginRequest, ILoginResponse } from "../../api/auth/types"
import { loginStart, loginSuccess, loginFailure, logoutSuccess, loadProfileStart, loadProfileFailure, loadProfileSuccess } from "./authReducer"
import { history } from "../../utils/history"
import { store } from ".."
import { AxiosPromise } from "axios"
import { isTokenExpired } from "../../utils/jwt"

export const loginUser = (data: ILoginRequest) => async (dispatch: Dispatch<any>): Promise<void> => {
		try {
			dispatch(loginStart())

			const res = await api.auth.login(data)

			dispatch(loginSuccess(res.data.accessToken))
			dispatch(getProfile())
		} catch (e: any) {
			console.error(e)

			dispatch(loginFailure(e.message))
		}
}

export const logoutUser = () => async (dispatch: Dispatch): Promise<void> => {
		try {
			await api.auth.logout()

			dispatch(logoutSuccess())

			history.push("/")
		} catch (e) {
			console.error(e)
		}
	}

export const getProfile = () => async (dispatch: Dispatch<any>): Promise<void> => {
   console.log("getProfile Func")
		try {
			dispatch(loadProfileStart())

			const res = await api.auth.getProfile()

			dispatch(loadProfileSuccess(res.data))
		} catch (e: any) {
			console.error(e)

			dispatch(loadProfileFailure(e.message))
		}
	}

// variable to store request token ( to prevent race condition )
let refreshTokenRequest: AxiosPromise<ILoginResponse> | null = null

export const getAccessToken = () => async (dispatch: Dispatch<any>): Promise<string | null> => {
   console.log("GetAccessToken func")
		try {
			const accessToken = store.getState().auth.authData.accessToken

			if (!accessToken || isTokenExpired(accessToken)) {
				if (refreshTokenRequest === null) {
					refreshTokenRequest = api.auth.refreshToken()
				}

				const res = await refreshTokenRequest // * when we do this request, backend specifies refreshToken in cookies and return accessToken
				refreshTokenRequest = null

				dispatch(loginSuccess(res.data.accessToken))

				return res.data.accessToken
			}

			return accessToken
		} catch (e) {
			console.error(e)

			return null
		}
	}
