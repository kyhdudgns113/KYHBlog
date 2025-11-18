import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './TitlePart.scss'

type TitlePartProps = DivCommonProps & {}

export const TitlePart: FC<TitlePartProps> = ({...props}) => {
  return (
    <div className={`Title_Part`} {...props}>
      강영훈의 블로그
    </div>
  )
}
