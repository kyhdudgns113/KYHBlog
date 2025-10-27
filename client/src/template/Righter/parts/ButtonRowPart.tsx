import {SettingButton} from '../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_ButtonRow.scss'

type ButtonRowPartProps = DivCommonProps & {}

export const ButtonRowPart: FC<ButtonRowPartProps> = ({className, ...props}) => {
  return (
    <div className={`ButtonRow_Part ${className || ''}`} {...props}>
      <SettingButton />
    </div>
  )
}
