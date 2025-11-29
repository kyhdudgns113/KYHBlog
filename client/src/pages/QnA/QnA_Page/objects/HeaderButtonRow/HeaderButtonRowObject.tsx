import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderButtonRowObject.scss'

type HeaderButtonRowObjectProps = DivCommonProps & {}

export const HeaderButtonRowObject: FC<HeaderButtonRowObjectProps> = ({className, ...props}) => {
  return (
    <div className={`HeaderButtonRow_Object ${className || ''}`} {...props}>
      {/* 버튼 행 영역 */}
      <div>버튼 행</div>
    </div>
  )
}

