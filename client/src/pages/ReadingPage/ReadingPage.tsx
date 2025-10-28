import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReadingPageProps = DivCommonProps & {}

export const ReadingPage: FC<ReadingPageProps> = ({className, ...props}) => {
  return (
    <div className={`ReadingPage ${className || ''}`} {...props}>
      <h1>ReadingPage</h1>
    </div>
  )
}
