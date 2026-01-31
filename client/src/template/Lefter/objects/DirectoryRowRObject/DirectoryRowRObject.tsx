import {useEffect, useState} from 'react'
import {useBlogSelector} from '@redux'
import {useDirectoryCallbacksContext} from '@context'

import {DirInfoGroup} from '../../groups'
import {FileRowRObject} from '../FileRowRObject'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as NV from '@nullValue'
import * as LT from '@localizeType'

import './DirectoryRowRObject.scss'

type DirectoryRowRObjectProps = DivCommonProps & {dirOId: string}

export const DirectoryRowRObject: FC<DirectoryRowRObjectProps> = ({dirOId, ...props}) => {
  const directories = useBlogSelector(state => state.directory.directories)
  const {loadDirectory} = useDirectoryCallbacksContext()

  const [directory, setDirectory] = useState<LT.DirectoryTypeLocal>(NV.NULL_DIR())
  const [isOpen, setIsOpen] = useState<boolean>(false)

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
    <div className={`DirectoryRow_RObject`} {...props}>
      {/* 1. 본인 정보 */}
      <DirInfoGroup directory={directory} isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`_container_object`}>
        {/* 2. 자식 폴더 목록 */}
        {isOpen &&
          directory.subDirOIdsArr.map((subDirOId, subDirIdx) => {
            return <DirectoryRowRObject key={subDirIdx} dirOId={subDirOId} />
          })}

        {/* 3. 자식 파일 목록 */}
        {isOpen &&
          directory.fileOIdsArr.map((fileOId, fileIdx) => {
            return <FileRowRObject key={fileIdx} fileOId={fileOId} />
          })}
      </div>
    </div>
  )
}
