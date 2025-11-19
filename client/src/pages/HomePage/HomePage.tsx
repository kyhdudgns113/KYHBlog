import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HomePage.scss'

type HomePageProps = DivCommonProps & {}

export const HomePage: FC<HomePageProps> = ({...props}) => {
  return (
    <div className={`HomePage`} {...props}>
      <h1>HomePage</h1>
    </div>
  )
}
