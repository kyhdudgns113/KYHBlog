import {UsersButton} from '../../buttons'
import {UsersStatusObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './UsersPart.scss'

type UsersPartProps = DivCommonProps & {}

export const UsersPart: FC<UsersPartProps> = ({...props}) => {
  return (
    <div className={`Users_Part`} {...props}>
      {/* 1. 타이틀 */}
      <p className={`_title_part`}>Users</p>

      {/* 2. 사용자 현황 */}
      <UsersStatusObject />

      {/* 2. Users 버튼 */}
      <UsersButton />
    </div>
  )
}
