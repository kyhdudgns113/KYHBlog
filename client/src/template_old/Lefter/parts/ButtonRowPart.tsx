import {useAuthStatesContext} from '@context'
import {AUTH_ADMIN} from '@shareValue'
import {AdminButton, PostButton} from '../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_ButtonRow.scss'

type ButtonRowPartProps = DivCommonProps & {}

export const ButtonRowPart: FC<ButtonRowPartProps> = ({className, ...props}) => {
  const {userAuth} = useAuthStatesContext()

  return (
    <div className={`ButtonRow_Part ${className || ''}`} {...props}>
      {userAuth === AUTH_ADMIN && <AdminButton />}
      {userAuth === AUTH_ADMIN && <PostButton />}
    </div>
  )
}
