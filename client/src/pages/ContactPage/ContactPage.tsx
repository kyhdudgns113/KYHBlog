import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './ContactPage.scss'

type ContactPageProps = DivCommonProps & {}

export const ContactPage: FC<ContactPageProps> = ({...props}) => {
  return (
    <div className={`ContactPage`} {...props}>
      <p>연락처 페이지</p>
    </div>
  )
}

