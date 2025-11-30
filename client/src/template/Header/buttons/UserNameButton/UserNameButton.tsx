import {useAuthStatesContext} from '@context'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './UserNameButton.scss'

type UserNameButtonProps = DivCommonProps & {}

export const UserNameButton: FC<UserNameButtonProps> = ({...props}) => {
  const {userName} = useAuthStatesContext()

  return (
    <div className={`UserName_Button`} {...props}>
      {userName}
    </div>
  )
}
