import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/Header.scss'

type HeaderProps = DivCommonProps & {}

export const Header: FC<HeaderProps> = ({className, ...props}) => {
  return (
    <div className={`Header ${className || ''}`} {...props}>
      Header
    </div>
  )
}
