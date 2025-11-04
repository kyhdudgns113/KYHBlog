import {useEffect, useState} from 'react'

import {useDirectoryCallbacksContext} from '@context'
import {useBlogSelector} from '@redux'

import {DirectoryInfoGroup, DirectorySpaceGroup} from '../../groups'
import {AddDirectoryObject, AddFileObject, FileRowObject} from '../'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as NV from '@nullValue'
import * as ST from '@shareType'

import './DirectoryRowObject.scss'

type DirectoryRowObjectProps = DivCommonProps & {
  dirIdx: number
  dirOId: string
  parentDirOId: string
}

export const DirectoryRowObject: FC<DirectoryRowObjectProps> = ({dirIdx, dirOId, parentDirOId, className, ...props}) => {
  const directories = useBlogSelector(state => state.directory.directories)
  const dirOId_addDir = useBlogSelector(state => state.directory.dirOId_addDir)
  const dirOId_addFile = useBlogSelector(state => state.directory.dirOId_addFile)
  const {loadDirectory} = useDirectoryCallbacksContext()

  const [directory, setDirectory] = useState<ST.DirectoryType>(NV.NULL_DIR())
  const [isOpen, setIsOpen] = useState<boolean>(false) // eslint-disable-line

  // 초기화: directory
  useEffect(() => {
    if (!dirOId) return

    const directory = directories[dirOId]
    if (directory) {
      setDirectory(directory)
    } // ::
    else {
      loadDirectory(dirOId)
    }
  }, [dirOId, directories])

  return (
    <div
      className={`DirectoryRow_Object ${className || ''}`}
      onDragOver={e => e.preventDefault()}
      {...props} // ::
    >
      {/* 1. 폴더 이동용 공간(dirIdx 0 일때) */}
      {dirIdx === 0 && <DirectorySpaceGroup parentDirOId={parentDirOId} rowIdx={dirIdx} />}

      {/* 2. 자신의 정보, 버튼들 */}
      <DirectoryInfoGroup directory={directory} dirOId={dirOId} isOpen={isOpen} setIsOpen={setIsOpen} />

      {isOpen && (
        <div onDragOver={e => e.preventDefault()} style={{marginLeft: '8px'}}>
          {/* 3. 자식 디렉토리들(재귀) */}
          {directory.subDirOIdsArr.map((subDirOId, subDirIdx) => (
            <DirectoryRowObject key={subDirIdx} dirIdx={subDirIdx} dirOId={subDirOId} parentDirOId={dirOId} />
          ))}

          {/* 4. 자식 폴더 생성 행 */}
          {dirOId_addDir === dirOId && <AddDirectoryObject dirOId={dirOId} />}

          {/* 5. 자식 파일들 */}
          {directory.fileOIdsArr.map((fileOId, fileIdx) => (
            <FileRowObject key={fileIdx} parentDirOId={dirOId} fileIdx={fileIdx} fileOId={fileOId} />
          ))}

          {/* 6. 자식 파일 추가 행 */}
          {dirOId_addFile === dirOId && <AddFileObject dirOId={dirOId} />}
        </div>
      )}

      {/* 7. 폴더 이동용 공간(dirIdx 무관) */}
      <DirectorySpaceGroup parentDirOId={parentDirOId} rowIdx={dirIdx + 1} />
    </div>
  )
}
