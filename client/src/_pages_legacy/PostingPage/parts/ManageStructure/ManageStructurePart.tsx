import {useBlogSelector} from '@redux'

import {HeaderRowObject, DirectoryRowObject, FileRowObject, AddDirectoryObject, AddFileObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './ManageStructurePart.scss'

type ManageStructurePartProps = DivCommonProps & {}

export const ManageStructurePart: FC<ManageStructurePartProps> = ({className, ...props}) => {
  const dirOId_addDir = useBlogSelector(state => state.directory.dirOId_addDir)
  const dirOId_addFile = useBlogSelector(state => state.directory.dirOId_addFile)
  const rootDir = useBlogSelector(state => state.directory.rootDir)
  const rootDirOId = useBlogSelector(state => state.directory.rootDirOId)

  return (
    <div className={`ManageStructure_Part SCROLL_SAKURA ${className || ''}`} {...props}>
      {/* 1. 헤더 버튼 행 */}
      <HeaderRowObject />

      {/* 2. 루트 폴더의 자식 폴더들 */}
      {rootDir.subDirOIdsArr.map((dirOId, dirIdx) => {
        return <DirectoryRowObject key={dirIdx} dirIdx={dirIdx} dirOId={dirOId} parentDirOId={rootDir.dirOId} />
      })}

      {/* 3. 루트 폴더의 자식 폴더 생성 행 */}
      {dirOId_addDir === rootDirOId && <AddDirectoryObject dirOId={rootDirOId} />}

      {/* 4. 루트 폴더의 자식 파일들 */}
      {rootDir.fileOIdsArr.map((fileOId, fileIdx) => {
        return <FileRowObject key={fileIdx} fileIdx={fileIdx} fileOId={fileOId} parentDirOId={rootDir.dirOId} />
      })}

      {/* 5. 루트 폴더의 자식 파일 생성 행 */}
      {dirOId_addFile === rootDirOId && <AddFileObject dirOId={rootDirOId} />}
    </div>
  )
}
