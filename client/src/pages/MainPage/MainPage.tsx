import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type MainPageProps = DivCommonProps & {}

export const MainPage: FC<MainPageProps> = ({className, ...props}) => {
  return (
    <div className={`MainPage ${className || ''}`} {...props}>
      <h1>MainPage</h1>
    </div>
  )
}
