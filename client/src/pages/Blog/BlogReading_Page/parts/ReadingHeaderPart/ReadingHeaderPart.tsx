import {HeaderNameObject, HeaderUserObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './ReadingHeaderPart.scss'

type ReadingHeaderPartProps = DivCommonProps

export const ReadingHeaderPart: FC<ReadingHeaderPartProps> = ({className, style, ...props}) => {
  return (
    <div className={`ReadingHeader_Part ${className || ''}`} style={style} {...props}>
      <HeaderNameObject />
      <HeaderUserObject />
      <div className="_bottomLine" />
    </div>
  )
}
