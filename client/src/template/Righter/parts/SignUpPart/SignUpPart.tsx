import {useCallback, useState} from 'react'

import {useAuthCallbacksContext} from '@context'
import {useBlogSelector} from '@redux'

import type {FC, FormEvent, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './SignUpPart.scss'

type SignUpPartProps = DivCommonProps & {
  closePart: () => void
}

export const SignUpPart: FC<SignUpPartProps> = ({closePart, className, ...props}) => {
  const signUpLock = useBlogSelector(state => state.lock.signUpLock)

  const {signUp} = useAuthCallbacksContext()

  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [userMail, setUserMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  const _executeSignUp = useCallback(
    (signUpLock: boolean, userId: string, userMail: string, userName: string, password: string, passwordConfirm: string) => {
      if (signUpLock) {
        alert('회원가입 하고있어요')
        return
      }
      signUp(userId, userMail, userName, password) // ::
        .then(res => {
          if (res) {
            closePart()
          }
        })
    },
    []
  )

  const onClickClose = useCallback(() => {
    setUserId('')
    setUserName('')
    setUserMail('')
    setPassword('')
    setPasswordConfirm('')
    closePart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = useCallback(
    (signUpLock: boolean, userId: string, userMail: string, userName: string, password: string, passwordConfirm: string) =>
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.stopPropagation()
          e.preventDefault()
          _executeSignUp(signUpLock, userId, userMail, userName, password, passwordConfirm)
        } // ::
        else if (e.key === 'Escape') {
          closePart()
        }
      },
    [_executeSignUp]
  )

  const onSubmit = useCallback(
    (signUpLock: boolean, userId: string, userMail: string, userName: string, password: string, passwordConfirm: string) =>
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        _executeSignUp(signUpLock, userId, userMail, userName, password, passwordConfirm)
      },
    []
  )

  return (
    <div
      className={`SignUp_Part ${className || ''}`}
      onKeyDown={onKeyDown(signUpLock, userId, userMail, userName, password, passwordConfirm)}
      {...props}
    >
      {/* 1. 타이틀 */}
      <p className={`title_part`}>회원가입</p>

      <form className={`form_part`} onSubmit={onSubmit(signUpLock, userId, userMail, userName, password, passwordConfirm)}>
        {/* 2. 입력: ID */}
        <div className={`form_item`}>
          <label htmlFor="userId">ID</label>
          <input autoFocus type="text" id="userId" name="userId" onChange={e => setUserId(e.target.value)} required value={userId} />
        </div>

        {/* 3. 입력: 이름 */}
        <div className={`form_item`}>
          <label htmlFor="userName">이름</label>
          <input type="text" id="userName" name="userName" onChange={e => setUserName(e.target.value)} required value={userName} />
        </div>

        {/* 4. 입력: 이메일 */}
        <div className={`form_item`}>
          <label htmlFor="userMail">이메일</label>
          <input type="email" id="userMail" name="userMail" onChange={e => setUserMail(e.target.value)} required value={userMail} />
        </div>

        {/* 5. 입력: 비밀번호 */}
        <div className={`form_item`}>
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} required value={password} />
        </div>

        {/* 6. 입력: 비밀번호 확인 */}
        <div className={`form_item`}>
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            onChange={e => setPasswordConfirm(e.target.value)}
            required
            value={passwordConfirm}
          />
        </div>

        {/* 7. 버튼 행 */}
        <div className={`form_button_row`}>
          <button type="submit">Sign Up</button>
          <button type="button" onClick={onClickClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  )
}
