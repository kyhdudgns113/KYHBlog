import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HomePage.scss'

type HomePageProps = DivCommonProps & {}

export const HomePage: FC<HomePageProps> = ({...props}) => {
  return (
    <div className={`HomePage`} {...props}>
      <p>홈 페이지는 어떻게 구성하지?</p>
    </div>
  )
}
