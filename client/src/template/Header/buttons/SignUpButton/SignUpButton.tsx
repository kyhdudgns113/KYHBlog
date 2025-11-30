import {useCallback} from 'react'

import {useBlogDispatch, useTemplateActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './SignUpButton.scss'

type SignUpButtonProps = DivCommonProps & {}

export const SignUpButton: FC<SignUpButtonProps> = ({...props}) => {
  const {clickSignUpBtn} = useTemplateActions()

  const dispatch = useBlogDispatch()

  const onClickSignUp = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      dispatch(clickSignUpBtn())
    },
    [dispatch] // eslint-disable-line react-hooks/exhaustive-deps
  )
  return (
    <div className={`SignUpButton`} onClick={onClickSignUp} {...props}>
      Sign Up
    </div>
  )
}
