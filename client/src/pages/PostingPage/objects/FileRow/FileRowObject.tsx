import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './FileRowObject.scss'

type FileRowObjectProps = DivCommonProps & {
  fileIdx: number
  fileOId: string
  parentDirOId: string
}

export const FileRowObject: FC<FileRowObjectProps> = ({fileIdx, fileOId, parentDirOId, className, ...props}) => {
  return (
    <div className={`FileRow_Object ${className || ''}`} {...props}>
      FileRowObject
    </div>
  )
}
