import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './IntroPart.scss'

type IntroPartProps = DivCommonProps & {}

export const IntroPart: FC<IntroPartProps> = ({...props}) => {
  return (
    <div className={`Intro_Part`} {...props}>
      <p>블로그에 오신걸 환영합니다~</p>
    </div>
  )
}
