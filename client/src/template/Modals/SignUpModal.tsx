import {useCallback} from 'react'

import {Modal} from '@component'
import {useModalActions} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/_ModalCommon.scss'
import './_styles/SignUpModal.scss'

type SignUpModalProps = DivCommonProps & {}

export const SignUpModal: FC<SignUpModalProps> = ({className, ...props}) => {
  const {closeModal} = useModalActions()
  const onClose = useCallback(() => {
    closeModal()
  }, [closeModal])

  return (
    <Modal className={`SignUp_Modal _modal_template ${className || ''}`} onClose={onClose} {...props}>
      {/* 1. 타이틀 */}
      <p className="_title_modal">회원가입</p>

      {/* 2. 폼 */}
      <form className="_form_modal">
        <div className="_form_item">
          <label htmlFor="userId">ID</label>
          <input autoFocus type="text" id="userId" name="userId" tabIndex={1} />
        </div>
        <div className="_form_item">
          <label htmlFor="userMail">Email</label>
          <input type="email" id="userMail" name="userMail" tabIndex={2} />
        </div>
        <div className="_form_item">
          <label htmlFor="userName">이름</label>
          <input type="text" id="userName" name="userName" tabIndex={3} />
        </div>
        <div className="_form_item">
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" tabIndex={4} />
        </div>
        <div className="_form_item">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input type="password" id="passwordConfirm" name="passwordConfirm" tabIndex={5} />
        </div>
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
