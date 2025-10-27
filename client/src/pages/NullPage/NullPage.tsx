import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/_NullPage.scss'

type NullPageProps = DivCommonProps & {}

export const NullPage: FC<NullPageProps> = ({className, ...props}) => {
  return (
    <div className={`NullPage ${className || ''}`} {...props}>
      존재하지 않는 페이지입니다.
    </div>
  )
}
