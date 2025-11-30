import {useCallback, useState} from 'react'

import {useAuthCallbacksContext} from '@context'
import {useBlogSelector} from '@redux'

import type {FC, FormEvent, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './LogInPart.scss'

type LogInPartProps = DivCommonProps & {
  closePart: () => void
}

export const LogInPart: FC<LogInPartProps> = ({closePart, className, ...props}) => {
  const logInLock = useBlogSelector(state => state.lock.logInLock)

  const {logIn} = useAuthCallbacksContext()

  const [userId, setUserId] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const _executeLogIn = useCallback((logInLock: boolean, userId: string, password: string) => {
    if (logInLock) {
      alert('로그인 하고있어요')
      return
    }

    logIn(userId, password) // ::
      .then(res => {
        if (res) {
          closePart()
        }
      })
  }, [])

  const onClickClose = useCallback(() => {
    setUserId('')
    setPassword('')
    closePart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = useCallback(
    (logInLock: boolean, userId: string, password: string) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.stopPropagation()
        e.preventDefault()
        _executeLogIn(logInLock, userId, password)
      } // ::
      else if (e.key === 'Escape') {
        closePart()
      }
    },
    [_executeLogIn]
  )

  const onSubmit = useCallback(
    (logInLock: boolean, userId: string, password: string) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()
      _executeLogIn(logInLock, userId, password)
    },
    []
  )

  return (
    <div className={`LogIn_Part ${className || ''}`} onKeyDown={onKeyDown(logInLock, userId, password)} {...props}>
      {/* 1. 타이틀 */}
      <p className={`title_part`}>로그인</p>

      <form className={`form_part`} onSubmit={onSubmit(logInLock, userId, password)}>
        {/* 2. 입력: ID */}
        <div className={`form_item`}>
          <label htmlFor="userId">ID</label>
          <input autoFocus type="text" id="userId" name="userId" onChange={e => setUserId(e.target.value)} required value={userId} />
        </div>

        {/* 3. 입력: 비밀번호 */}
        <div className={`form_item`}>
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} required value={password} />
        </div>

        {/* 4. 버튼 행 */}
        <div className={`form_button_row`}>
          <button type="submit">Log In</button>
          <button type="button" onClick={onClickClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  )
}
