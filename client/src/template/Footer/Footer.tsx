import './Footer.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type FooterProps = DivCommonProps & {}

export const Footer: FC<FooterProps> = ({...props}) => {
  return (
    <div className={`Footer`} {...props}>
      <p className="_title_footer">Footer</p>
    </div>
  )
}
