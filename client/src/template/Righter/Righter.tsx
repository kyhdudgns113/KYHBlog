import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type RighterProps = DivCommonProps & {}

export const Righter: FC<RighterProps> = ({className, ...props}) => {
  return (
    <div className={`Righter ${className || ''}`} {...props}>
      Righter
    </div>
  )
}
