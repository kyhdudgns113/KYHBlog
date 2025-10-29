import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './AddFileObject.scss'

type AddFileObjectProps = DivCommonProps & {}

export const AddFileObject: FC<AddFileObjectProps> = ({className, ...props}) => {
  return (
    <div className={`AddFile_Object ${className || ''}`} {...props}>
      AddFileObject
    </div>
  )
}
