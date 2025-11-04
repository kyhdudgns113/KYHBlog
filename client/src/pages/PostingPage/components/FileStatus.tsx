import {useEffect, useState} from 'react'
import {useBlogSelector} from '@redux'
import {FILE_NORMAL, FILE_NOTICE, FILE_HIDDEN} from '@shareValue'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './FileStatus.scss'

type FileStatusProps = DivCommonProps & {fileOId: string}

export const FileStatus: FC<FileStatusProps> = ({fileOId, className, style, ...props}) => {
  const fileRows = useBlogSelector(state => state.directory.fileRows)

  const [fileStatus, setFileStatus] = useState<number>(FILE_NORMAL)

  useEffect(() => {
    setFileStatus(fileRows[fileOId]?.fileStatus || FILE_NORMAL)
  }, [fileOId, fileRows])

  if (fileStatus === FILE_NORMAL) return null

  return (
    <div
      className={`FileStatus ${fileStatus === FILE_NOTICE ? '_isNoticeFile' : ''} ${fileStatus === FILE_HIDDEN ? '_isHiddenFile' : ''} ${
        className || ''
      }`}
      style={style}
      {...props}
    >
      {fileStatus === FILE_NOTICE && `공지`}
      {fileStatus === FILE_HIDDEN && `숨김`}
    </div>
  )
}
