import {useCallback, useState} from 'react'

import {Modal} from '@component'
import {useAuthCallbacksContext} from '@context'
import {useBlogSelector, useModalActions} from '@redux'

import type {FC, FormEvent, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/_ModalCommon.scss'
import './SignUpModal.scss'

import * as SV from '@shareValue'

type SignUpModalProps = DivCommonProps & {}

export const SignUpModal: FC<SignUpModalProps> = ({className, ...props}) => {
  const signUpLock = useBlogSelector(state => state.lock.signUpLock)
  const {closeModal} = useModalActions()
  const {signUp} = useAuthCallbacksContext()

  const [userId, setUserId] = useState<string>('')
  const [userMail, setUserMail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  const _executeSignUp = useCallback(
    (userId: string, userMail: string, userName: string, password: string, passwordConfirm: string) => {
      // 1. 입력값 췍: userId
      if (!userId || userId.length < SV.USER_ID_LENGTH_MIN || userId.length > SV.USER_ID_LENGTH_MAX) {
        alert(`userId 는 ${SV.USER_ID_LENGTH_MIN}자 이상 ${SV.USER_ID_LENGTH_MAX}자 이하여야 합니다.`)
        return
      }
      if (!SV.REGIX_USER_ID.test(userId)) {
        alert('userId 는 영문 대소문자, 숫자, 언더바(_), 마침표(.)만 포함할 수 있습니다.')
        return
      }

      // 2. 입력값 췍: userMail
      if (!userMail || !SV.REGIX_USER_MAIL.test(userMail)) {
        alert('userMail 는 이메일 형식이어야 합니다.')
        return
      }

      // 3. 입력값 췍: userName
      if (!userName || userName.length < SV.USER_NAME_LENGTH_MIN || userName.length > SV.USER_NAME_LENGTH_MAX) {
        alert(`userName 는 ${SV.USER_NAME_LENGTH_MIN}자 이상 ${SV.USER_NAME_LENGTH_MAX}자 이하여야 합니다.`)
        return
      }
      if (!SV.REGIX_USER_NAME.test(userName)) {
        alert('userName 는 한글, 영문 대소문자, 숫자, 언더바(_)만 포함할 수 있습니다.')
        return
      }

      // 4. 입력값 췍: password
      if (!password || password.length < SV.PASSWORD_LENGTH_MIN || password.length > SV.PASSWORD_LENGTH_MAX) {
        alert(`password 는 ${SV.PASSWORD_LENGTH_MIN}자 이상 ${SV.PASSWORD_LENGTH_MAX}자 이하여야 합니다.`)
        return
      }
      if (!SV.REGIX_PASSWORD.test(password)) {
        alert('password 는 영문 대소문자, 숫자, 특수문자를 각각 포함하여 8자 이상으로 입력해주세요.')
        return
      }
      if (password !== passwordConfirm) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
        return
      }

      if (signUpLock) {
        alert('회원가입 중입니다.')
        return
      }
      signUp(userId, userMail, userName, password) // ::
        .then(res => {
          if (res) {
            closeModal()
          }
        })
    },
    [signUpLock, closeModal, signUp]
  )

  const onClose = useCallback(() => {
    closeModal()
  }, [closeModal])

  const onKeyDown = useCallback(
    (userId: string, userMail: string, userName: string, password: string, passwordConfirm: string) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        _executeSignUp(userId, userMail, userName, password, passwordConfirm)
      } // ::
      else if (e.key === 'Escape') {
        onClose()
      }
    },
    [_executeSignUp, onClose]
  )

  const onSubmit = useCallback(
    (userId: string, userMail: string, userName: string, password: string, passwordConfirm: string) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()
      _executeSignUp(userId, userMail, userName, password, passwordConfirm)
    },
    [_executeSignUp]
  )

  return (
    <Modal
      className={`SignUp_Modal _modal_template ${className || ''}`}
      onClose={onClose}
      onKeyDown={onKeyDown(userId, userMail, userName, password, passwordConfirm)}
      {...props}
    >
      {/* 1. 타이틀 */}
      <p className="_title_modal">회원가입</p>

      {/* 2. 폼 */}
      <form className="_form_modal" onSubmit={onSubmit(userId, userMail, userName, password, passwordConfirm)}>
        {/* 2-1. ID */}
        <div className="_form_item">
          <label htmlFor="userId">ID</label>
          <input autoFocus type="text" id="userId" name="userId" required value={userId} onChange={e => setUserId(e.target.value)} tabIndex={1} />
        </div>

        {/* 2-2. Email */}
        <div className="_form_item">
          <label htmlFor="userMail">Email</label>
          <input type="email" id="userMail" name="userMail" required value={userMail} onChange={e => setUserMail(e.target.value)} tabIndex={2} />
        </div>

        {/* 2-3. 이름 */}
        <div className="_form_item">
          <label htmlFor="userName">이름</label>
          <input type="text" id="userName" name="userName" required value={userName} onChange={e => setUserName(e.target.value)} tabIndex={3} />
        </div>

        {/* 2-4. 비밀번호 */}
        <div className="_form_item">
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" required value={password} onChange={e => setPassword(e.target.value)} tabIndex={4} />
        </div>

        {/* 2-5. 비밀번호 확인 */}
        <div className="_form_item">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            required
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            tabIndex={5}
          />
        </div>

        {/* 2-6. 버튼 */}
        <div className="_form_button_row">
          <button className="_button_form" type="submit" tabIndex={6}>
            가입
          </button>
          <button className="_button_form" type="button" onClick={onClose} tabIndex={7}>
            취소
          </button>
        </div>
      </form>
    </Modal>
  )
}
