import {useCallback, useState} from 'react'

import {Modal} from '@component'
import {useAuthCallbacksContext} from '@context'
import {useLockStates, useModalActions} from '@redux'

import type {FC, FormEvent, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/_ModalCommon.scss'
import './LogInModal.scss'

type LogInModalProps = DivCommonProps & {}

export const LogInModal: FC<LogInModalProps> = ({className, ...props}) => {
  const {logInLock} = useLockStates()
  const {closeModal} = useModalActions()
  const {logIn} = useAuthCallbacksContext()

  const [userId, setUserId] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const _executeLogIn = useCallback(
    (userId: string, password: string) => {
      if (logInLock) {
        alert('로그인 하고있어요')
        return
      }
      logIn(userId, password) // ::
        .then(res => {
          if (res) {
            closeModal()
          }
        })
        .catch(err => {
          alert(err)
        })
    },
    [logInLock, closeModal, logIn]
  )

  const onClose = useCallback(() => {
    closeModal()
  }, [closeModal])

  const onKeyDown = useCallback(
    (userId: string, password: string) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.stopPropagation()
        e.preventDefault()
        _executeLogIn(userId, password)
      } // ::
      else if (e.key === 'Escape') {
        onClose()
      }
    },
    [_executeLogIn, onClose]
  )
  const onSubmit = useCallback(
    (userId: string, password: string) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()
      _executeLogIn(userId, password)
    },
    [_executeLogIn]
  )
  return (
    <Modal className={`LogIn_Modal _modal_template ${className || ''}`} onClose={onClose} onKeyDown={onKeyDown(userId, password)} {...props}>
      {/* 1. 타이틀 */}
      <p className="_title_modal">로그인</p>

      {/* 2. 폼 */}
      <form className="_form_modal" onSubmit={onSubmit(userId, password)}>
        {/* 2-1. ID */}
        <div className="_form_item">
          <label htmlFor="userId">ID</label>
          <input autoFocus type="text" id="userId" name="userId" required value={userId} onChange={e => setUserId(e.target.value)} tabIndex={1} />
        </div>

        {/* 2-2. 비밀번호 */}
        <div className="_form_item">
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" required value={password} onChange={e => setPassword(e.target.value)} tabIndex={4} />
        </div>

        {/* 2-3. 버튼 */}
        <div className="_form_button_row">
          <button className="_button_form" type="submit" tabIndex={6}>
            로그인
          </button>
          <button className="_button_form" type="button" onClick={onClose} tabIndex={7}>
            닫기
          </button>
        </div>
      </form>
    </Modal>
  )
}
