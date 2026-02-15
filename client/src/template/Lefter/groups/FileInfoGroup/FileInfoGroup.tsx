import {useEffect, useState} from 'react'

import {Icon} from '@component'
import {useBlogSelector} from '@redux'

import {FileStatusButton} from '../../buttons'
import {NewFile} from '../../components'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './FileInfoGroup.scss'

type FileInfoGroupProps = DivCommonProps & {fileOId: string}

export const FileInfoGroup: FC<FileInfoGroupProps> = ({fileOId, className, ...props}) => {
  const fileRows = useBlogSelector(state => state.directory.fileRows)

  const [isNewFile, setIsNewFile] = useState<boolean>(false)

  // 초기화: isNewFile
  useEffect(() => {
    const now = Date.now()
    const oneWeekAgo = now - SV.DATE_DIFF_NEW_FILE
    setIsNewFile(fileRows[fileOId]?.updatedAtValue > oneWeekAgo)
  }, [fileOId, fileRows])

  return (
    <div className={`FileInfo_Group ${isNewFile ? ' _isNewFile ' : ' _isNotNewFile '} ${className || ''}`} {...props}>
      {/* 1. 파일 아이콘 */}
      <Icon iconName="article" style={{fontSize: '18px', marginLeft: '4px', marginRight: '4px'}} />

      {/* 2. 새 파일 표시 */}
      <NewFile fileOId={fileOId} />

      {/* 3. 파일 이름 */}
      <p className={`_title_group `}>{fileRows[fileOId]?.fileName || 'ERROR'}</p>

      {/* 4. 파일 상태 아이콘 */}
      <FileStatusButton fileOId={fileOId} />
    </div>
  )
}
