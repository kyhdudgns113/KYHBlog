import {useDirectoryStates} from '@redux'

import {DirectoryRowObject, FileRowObject} from '../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_DirectoryList.scss'

type DirectoryListPartProps = DivCommonProps & {}

export const DirectoryListPart: FC<DirectoryListPartProps> = ({className, ...props}) => {
  const {rootDir} = useDirectoryStates()

  return (
    <div className={`DirectoryList_Part SCROLL_SAKURA ${className || ''}`} {...props}>
      <div className="_container_part">
        {/* 1. 루트 폴더의 자식 폴더 목록 */}
        {rootDir.subDirOIdsArr.map((dirOId, dirIdx) => {
          return <DirectoryRowObject key={dirIdx} dirOId={dirOId} />
        })}

        {/* 2. 루트 폴더의 자식 파일 목록 */}
        {rootDir.fileOIdsArr.map((fileOId, fileIdx) => {
          return <FileRowObject key={fileIdx} fileOId={fileOId} />
        })}
      </div>
    </div>
  )
}
