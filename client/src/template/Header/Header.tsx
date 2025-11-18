import {ButtonRowPart, TitlePart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './Header.scss'

type HeaderProps = DivCommonProps & {}

export const Header: FC<HeaderProps> = ({...props}) => {
  return (
    <div className={`Header`} {...props}>
      <ButtonRowPart />
      <TitlePart />
    </div>
  )
}
