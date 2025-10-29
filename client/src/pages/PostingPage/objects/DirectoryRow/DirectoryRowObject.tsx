import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './DirectoryRowObject.scss'

type DirectoryRowObjectProps = DivCommonProps & {
  dirIdx: number
  dirOId: string
  parentDirOId: string
}

export const DirectoryRowObject: FC<DirectoryRowObjectProps> = ({dirIdx, dirOId, parentDirOId, className, ...props}) => {
  return (
    <div className={`DirectoryRow_Object ${className || ''}`} {...props}>
      DirectoryRowObject
    </div>
  )
}
