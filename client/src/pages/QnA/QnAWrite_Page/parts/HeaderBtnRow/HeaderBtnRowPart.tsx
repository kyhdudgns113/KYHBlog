import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderBtnRowPart.scss'

type HeaderBtnRowPartProps = DivCommonProps & {}

export const HeaderBtnRowPart: FC<HeaderBtnRowPartProps> = ({...props}) => {
  return (
    <div className={`HeaderBtnRow_Part `} {...props}>
      HeaderBtnRowPart.tsx
    </div>
  )
}

