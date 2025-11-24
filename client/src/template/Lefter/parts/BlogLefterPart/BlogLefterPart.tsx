import {useBlogSelector} from '@redux'

import {DirectoryRowRObject, FileRowRObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './BlogLefterPart.scss'

type BlogLefterPartProps = DivCommonProps & {
  closePart: () => void
}

export const BlogLefterPart: FC<BlogLefterPartProps> = ({closePart, className, ...props}) => {
  const rootDir = useBlogSelector(state => state.directory.rootDir)
  return (
    <div className={`BlogLefter_Part SCROLL_SAKURA ${className || ''}`} {...props}>
      {/* 1. 루트 폴더의 자식 폴더 목록 */}
      {rootDir.subDirOIdsArr.map((dirOId, dirIdx) => {
        return <DirectoryRowRObject key={dirIdx} dirOId={dirOId} />
      })}

      {/* 2. 루트 폴더의 자식 파일 목록 */}
      {rootDir.fileOIdsArr.map((fileOId, fileIdx) => {
        return <FileRowRObject key={fileIdx} fileOId={fileOId} />
      })}
    </div>
  )
}
