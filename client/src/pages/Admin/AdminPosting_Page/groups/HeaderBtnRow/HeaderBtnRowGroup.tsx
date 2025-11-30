import {NoticeFileButton, HideFileButton, EditFileButton, DeleteFileButton} from '../../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderBtnRowGroup.scss'

type HeaderBtnRowGroupProps = DivCommonProps & {}

export const HeaderBtnRowGroup: FC<HeaderBtnRowGroupProps> = ({className, ...props}) => {
  return (
    <div className={`HeaderBtnRow_Group ${className || ''}`} {...props}>
      <NoticeFileButton />
      <HideFileButton />
      <EditFileButton />
      <DeleteFileButton />
    </div>
  )
}

