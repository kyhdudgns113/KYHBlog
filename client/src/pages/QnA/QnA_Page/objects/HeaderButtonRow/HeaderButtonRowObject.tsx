import {WriteQnAButton} from '../../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderButtonRowObject.scss'

type HeaderButtonRowObjectProps = DivCommonProps & {}

export const HeaderButtonRowObject: FC<HeaderButtonRowObjectProps> = ({className, ...props}) => {
  return (
    <div className={`HeaderButtonRow_Object ${className || ''}`} {...props}>
      <WriteQnAButton />
    </div>
  )
}

