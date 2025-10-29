import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './FileContentsObject.scss'

type FileContentsObjectProps = DivCommonProps & {}

export const FileContentsObject: FC<FileContentsObjectProps> = ({className, ...props}) => {
  return (
    <div className={`FileContents_Object ${className || ''}`} {...props}>
      FileContentsObject
    </div>
  )
}
