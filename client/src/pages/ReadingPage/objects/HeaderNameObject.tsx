import {useFileStates} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_styles/HeaderNameObject.scss'

type HeaderNameObjectProps = DivCommonProps

export const HeaderNameObject: FC<HeaderNameObjectProps> = ({className, style, ...props}) => {
  const {file} = useFileStates()

  return (
    <div className={`HeaderName_Object ${className || ''}`} style={style} {...props}>
      <p className="_fileName">{file.fileName}</p>
    </div>
  )
}
