import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './NullPart.scss'

type NullPartProps = DivCommonProps & {}

export const NullPart: FC<NullPartProps> = ({...props}) => {
  return (
    <div className={`Null_Part`} {...props}>
      <p className="_title_part">준비중입니다...</p>
    </div>
  )
}
