import * as types from './actionTypes'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth, facebookAuthProvider, googleAuthProvider } from '../firebase'
import { SignupTypes } from '../constants/Signup'

// register / signup
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

// signin / login
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

// logout / signout
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

// google sign in
const googleSignInStart = (): any => ({
  type: types.GOOGLE_SIGN_IN_START
})

const googleSignInSuccess = (user: User): any => ({
  type: types.GOOGLE_SIGN_IN_SUCCESS,
  payload: user
})

const googleSignInFail = (error: any): any => ({
  type: types.GOOGLE_SIGN_IN_FAIL,
  payload: error
})

// facebook sign in
const fbSignInStart = (): any => ({
  type: types.FB_SIGN_IN_START
})

const fbSignInSuccess = (user: User): any => ({
  type: types.FB_SIGN_IN_SUCCESS,
  payload: user
})

const fbSignInFail = (error: any): any => ({
  type: types.FB_SIGN_IN_FAIL,
  payload: error
})

/**
 * initialize registration
 * @param email
 * @param password
 * @param displayName
 */
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

/**
 * initialize login
 * @param email
 * @param password
 */
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

/**
 * initialize logout
 */
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

/**
 * initialize google sign in
 */
export const googleSignInInitiate = () => {
  return function (dispatch: any) {
    dispatch(googleSignInStart())
    signInWithPopup(auth, googleAuthProvider)
      .then(({ user }) => {
        // Signed in
        dispatch(googleSignInSuccess(user))
      })
      .catch((error) => {
        dispatch(googleSignInFail(error.message))
      })
  }
}

/**
 * initialize facebook sign in
 */
export const fbSignInInitiate = () => {
  return function (dispatch: any) {
    dispatch(fbSignInStart())
    signInWithPopup(auth, facebookAuthProvider.addScope('user_birthday, email'))
      .then(({ user }) => {
        // Signed in
        dispatch(fbSignInSuccess(user))
      })
      .catch((error) => {
        dispatch(fbSignInFail(error.message))
      })
  }
}
