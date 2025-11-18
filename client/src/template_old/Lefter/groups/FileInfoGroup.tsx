import {Icon} from '@component'
import {useBlogSelector} from '@redux'

import {FileStatusButton} from '../buttons'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Grp_FileInfo.scss'

type FileInfoGroupProps = DivCommonProps & {fileOId: string}

export const FileInfoGroup: FC<FileInfoGroupProps> = ({fileOId, className, ...props}) => {
  const fileRows = useBlogSelector(state => state.directory.fileRows)

  return (
    <div className={`FileInfo_Group ${className || ''}`} {...props}>
      {/* 1. 파일 아이콘 */}
      <Icon iconName="article" style={{fontSize: '18px', marginLeft: '4px', marginRight: '4px'}} />

      {/* 2. 파일 이름 */}
      <p className="_title_group">{fileRows[fileOId]?.fileName || 'ERROR'}</p>

      {/* 3. 파일 상태 아이콘 */}
      <FileStatusButton fileOId={fileOId} />
    </div>
  )
}
