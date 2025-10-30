import {HeaderBtnRowGroup, HeaderTitleGroup} from '../../groups'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './FileHeaderObject.scss'

type FileHeaderObjectProps = DivCommonProps & {}

export const FileHeaderObject: FC<FileHeaderObjectProps> = ({className, ...props}) => {
  return (
    <div className={`FileHeader_Object ${className || ''}`} {...props}>
      <HeaderBtnRowGroup />
      <HeaderTitleGroup />
    </div>
  )
}
