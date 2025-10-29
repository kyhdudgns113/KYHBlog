import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './AddDirectoryObject.scss'

type AddDirectoryObjectProps = DivCommonProps & {}

export const AddDirectoryObject: FC<AddDirectoryObjectProps> = ({className, ...props}) => {
  return (
    <div className={`AddDirectory_Object ${className || ''}`} {...props}>
      AddDirectoryObject
    </div>
  )
}
