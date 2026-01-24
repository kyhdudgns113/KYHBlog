import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as LT from '@localizeType'

import './RecentFileRowRObject.scss'

type RecentFileRowRObjectProps = DivCommonProps & {fileRow: LT.FileRowTypeLocal}

export const RecentFileRowRObject: FC<RecentFileRowRObjectProps> = ({fileRow, className, ...props}) => {
  const navigate = useNavigate()

  const onClickFileRow = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      navigate(`/main/blog/${fileRow.fileOId}`)
    },
    [fileRow.fileOId, navigate]
  )

  return (
    <div className={`RecentFileRow_RObject ${className || ''}`} onClick={onClickFileRow} {...props}>
      {/* 1. 파일 아이콘 */}
      <Icon iconName="article" style={{fontSize: '18px', marginLeft: '4px', marginRight: '4px'}} />

      {/* 2. 파일 이름 */}
      <p className={`_title_object`}>{fileRow.fileName}</p>
    </div>
  )
}
