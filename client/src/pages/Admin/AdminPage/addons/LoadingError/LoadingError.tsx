import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type LoadingErrorProps = DivCommonProps & {}

export const LoadingError: FC<LoadingErrorProps> = ({className, style, ...props}) => {
  return (
    <div className={`LoadingError ${className || ''}`} style={style} {...props}>
      <p>Loading Error</p>
    </div>
  )
}
