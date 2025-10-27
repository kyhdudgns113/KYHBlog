import {FileInfoGroup} from '../groups'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_FileRow.scss'

type FileRowObjectProps = DivCommonProps & {fileOId: string}

export const FileRowObject: FC<FileRowObjectProps> = ({fileOId, className, ...props}) => {
  return (
    <div className={`FileRow_Object ${className || ''}`} {...props}>
      <FileInfoGroup fileOId={fileOId} />
    </div>
  )
}
