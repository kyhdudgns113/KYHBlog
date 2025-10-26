import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type FooterProps = DivCommonProps & {}

export const Footer: FC<FooterProps> = ({className, ...props}) => {
  return (
    <div className={`Footer ${className || ''}`} {...props}>
      Footer
    </div>
  )
}
