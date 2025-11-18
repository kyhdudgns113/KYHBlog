import {useCallback} from 'react'
import {useModalActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_SignUp.scss'

type SignUpObjectProps = DivCommonProps & {}

export const SignUpObject: FC<SignUpObjectProps> = ({className, ...props}) => {
  const {openSignUpModal} = useModalActions()

  const onClickSignUp = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      openSignUpModal()
    },
    [openSignUpModal]
  )

  return (
    <div className={`SignUp_Object ${className || ''}`} onClick={onClickSignUp} {...props}>
      Sign Up
    </div>
  )
}
