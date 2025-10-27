import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_DirectoryList.scss'

type DirectoryListPartProps = DivCommonProps & {}

export const DirectoryListPart: FC<DirectoryListPartProps> = ({className, ...props}) => {
  return (
    <div className={`DirectoryList_Part ${className || ''}`} {...props}>
      DirectoryList_Part
    </div>
  )
}
