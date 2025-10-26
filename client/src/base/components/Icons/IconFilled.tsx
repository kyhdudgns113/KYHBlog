import type {CSSProperties, FC} from 'react'
import type {SpanCommonProps} from '@prop'

export type IconFilledProps = SpanCommonProps & {
  iconName: string
  style?: CSSProperties
}

export const IconFilled: FC<IconFilledProps> = ({iconName, className, style, ...props}) => {
  return (
    <span className={`material-symbols-outlined fill align-middle select-none cursor-pointer  ${className || ''}`} style={style} {...props}>
      {iconName}
    </span>
  )
}
