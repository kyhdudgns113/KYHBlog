import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './Footer.scss'

type FooterProps = DivCommonProps & {}

export const Footer: FC<FooterProps> = ({className, ...props}) => {
  return (
    <div className={`Footer ${className || ''}`} {...props}>
      <div className="_container_contact">
        <p className="_email">E-mail: dudgns113@gmail.com</p>
        <p className="_kakaotalk">Kakao ID: kyhdudgns113</p>
      </div>
    </div>
  )
}
