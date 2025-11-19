import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

type HomePartProps = DivCommonProps & {}

export const HomePart: FC<HomePartProps> = ({...props}) => {
  return (
    <div className={`Home_Part _part_common`} {...props}>
      홈
    </div>
  )
}
