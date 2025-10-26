import {SignAreaPart, TitleAreaPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/_Header.scss'

type HeaderProps = DivCommonProps & {}

export const Header: FC<HeaderProps> = ({className, ...props}) => {
  return (
    <div className={`Header ${className || ''}`} {...props}>
      <SignAreaPart />
      <TitleAreaPart />
    </div>
  )
}
