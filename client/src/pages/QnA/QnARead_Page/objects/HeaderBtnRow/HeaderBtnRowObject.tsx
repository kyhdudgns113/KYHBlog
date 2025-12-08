import {EditQnAButton, DeleteQnAButton} from '../../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderBtnRowObject.scss'

type HeaderBtnRowObjectProps = DivCommonProps & {}

export const HeaderBtnRowObject: FC<HeaderBtnRowObjectProps> = ({className, ...props}) => {
  return (
    <div className={`HeaderBtnRow_Object ${className || ''}`} {...props}>
      <EditQnAButton />
      <DeleteQnAButton />
    </div>
  )
}

