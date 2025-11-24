import {PostingPart, UsersPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './AdminPage.scss'

type AdminPageProps = DivCommonProps & {}

export const AdminPage: FC<AdminPageProps> = ({...props}) => {
  return (
    <div className={`AdminPage`} {...props}>
      <div className="_pageWrapper">
        <PostingPart />
        <UsersPart />
      </div>
    </div>
  )
}
