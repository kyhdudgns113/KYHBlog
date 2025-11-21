import {useBlogSelector} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderNameObject.scss'

type HeaderNameObjectProps = DivCommonProps

export const HeaderNameObject: FC<HeaderNameObjectProps> = ({...props}) => {
  const file = useBlogSelector(state => state.file.file)

  return (
    <div className="HeaderName_Object" {...props}>
      <p className="_fileName">{file.fileName}</p>
    </div>
  )
}
