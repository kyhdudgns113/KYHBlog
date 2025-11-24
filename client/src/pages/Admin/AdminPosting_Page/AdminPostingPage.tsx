import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './AdminPostingPage.scss'

type AdminPostingPageProps = DivCommonProps & {}

export const AdminPostingPage: FC<AdminPostingPageProps> = ({...props}) => {
  return (
    <div className={`AdminPostingPage`} {...props}>
      AdminPostingPage
    </div>
  )
}
