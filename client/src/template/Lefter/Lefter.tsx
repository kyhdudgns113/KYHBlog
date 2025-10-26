import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type LefterProps = DivCommonProps & {}

export const Lefter: FC<LefterProps> = ({className, ...props}) => {
  return (
    <div className={`Lefter ${className || ''}`} {...props}>
      Lefter
    </div>
  )
}
