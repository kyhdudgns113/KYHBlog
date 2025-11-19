import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

type ContactPartProps = DivCommonProps & {}

export const ContactPart: FC<ContactPartProps> = ({...props}) => {
  return (
    <div className={`Contact_Part _part_common`} {...props}>
      Contact
    </div>
  )
}
