import {useEffect, useState} from 'react'
import {useBlogSelector} from '@redux'
import {useDirectoryCallbacksContext} from '@context'

import {DirInfoGroup} from '../../groups'
import {FileRowObj} from '../FileRowObj'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as ST from '@shareType'
import * as NV from '@nullValue'

import './DirectoryRowObj.scss'

type DirectoryRowObjProps = DivCommonProps & {dirOId: string}

export const DirectoryRowObj: FC<DirectoryRowObjProps> = ({dirOId, ...props}) => {
  const directories = useBlogSelector(state => state.directory.directories)
  const {loadDirectory} = useDirectoryCallbacksContext()

  const [directory, setDirectory] = useState<ST.DirectoryType>(NV.NULL_DIR())
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
    <div className={`DirectoryRow_Obj`} {...props}>
      {/* 1. 본인 정보 */}
      <DirInfoGroup dirName={directory?.dirName || 'ERROR'} isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="_container_object">
        {/* 2. 자식 폴더 목록 */}
        {isOpen &&
          directory.subDirOIdsArr.map((subDirOId, subDirIdx) => {
            return <DirectoryRowObj key={subDirIdx} dirOId={subDirOId} />
          })}

        {/* 3. 자식 파일 목록 */}
        {isOpen &&
          directory.fileOIdsArr.map((fileOId, fileIdx) => {
            return <FileRowObj key={fileIdx} fileOId={fileOId} />
          })}
      </div>
    </div>
  )
}
