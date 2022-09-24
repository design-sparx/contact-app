import * as types from './actionTypes'
import { createUserWithEmailAndPassword, updateProfile, User, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { SignupTypes } from '../constants/Signup'

const registerStart = (): any => ({
  type: types.REGISTER_START
})

const registerSuccess = (user: User): any => ({
  type: types.REGISTER_SUCCESS,
  payload: user
})

const registerFail = (error: any): any => ({
  type: types.REGISTER_FAIL,
  payload: error
})

const loginStart = (): any => ({
  type: types.LOGIN_START
})

const loginSuccess = (user: User): any => ({
  type: types.LOGIN_SUCCESS,
  payload: user
})

const loginFail = (error: any): any => ({
  type: types.LOGIN_FAIL,
  payload: error
})

const logoutStart = (): any => ({
  type: types.LOGOUT_START
})

const logoutSuccess = (): any => ({
  type: types.LOGOUT_SUCCESS
})

const logoutFail = (error: any): any => ({
  type: types.LOGOUT_FAIL,
  payload: error
})

export const setUser = (user: User | null): any => ({
  type: types.SET_USER,
  payload: user
})

export const registerInitiate = ({
  email,
  password,
  displayName
}: SignupTypes) => {
  return function (dispatch: any) {
    dispatch(registerStart())
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        // Signed in
        // Update profile
        updateProfile(user, {
          displayName
        })
          .then(() => dispatch(registerSuccess(user)))
          .catch(error => console.log(error))
      })
      .catch((error) => {
        dispatch(registerFail(error.message))
      })
  }
}

export const loginInitiate = ({
  email,
  password
}: SignupTypes) => {
  return function (dispatch: any) {
    dispatch(loginStart())
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        // Signed in
        dispatch(loginSuccess(user))
      })
      .catch((error) => {
        dispatch(loginFail(error.message))
      })
  }
}

export const logoutInitiate = () => {
  return function (dispatch: any) {
    dispatch(logoutStart())
    signOut(auth)
      .then(() => {
        dispatch(logoutSuccess())
      })
      .catch((error) => {
        dispatch(logoutFail(error.message))
      })
  }
}
