import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type MarginWidthBlockProps = DivCommonProps & {
  width: string
}

export const MarginWidthBlock: FC<MarginWidthBlockProps> = ({width, className, style, ...props}) => {
  const styleBlock: CSSProperties = {
    ...style,
    height: '100%',
    userSelect: 'none',
    width
  }

  return (
    <div className={`MARGIN_WIDTH_BLOCK ${className || ''}`} style={styleBlock} {...props}>
      &nbsp;
    </div>
  )
}
