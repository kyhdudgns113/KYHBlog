import {useEffect, useState} from 'react'

import {useDirectoryCallbacksContext} from '@context'
import {NULL_DIR} from '@nullValue'
import {useDirectoryStates} from '@redux'

import {DirInfoGroup} from '../groups'
import {FileRowObject} from './FileRowObject'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {DirectoryType} from '@shareType'

import '../_styles/Obj_DirectoryRow.scss'

type DirectoryRowObjectProps = DivCommonProps & {dirOId: string}

export const DirectoryRowObject: FC<DirectoryRowObjectProps> = ({dirOId, className, ...props}) => {
  const {directories} = useDirectoryStates()
  const {loadDirectory} = useDirectoryCallbacksContext()

  const [directory, setDirectory] = useState<DirectoryType>(NULL_DIR())
  const [isOpen, setIsOpen] = useState<boolean>(false) // eslint-disable-line

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
    <div className={`DirectoryRow_Object ${className || ''}`} {...props}>
      {/* 1. 본인 정보 */}
      <DirInfoGroup dirName={directory?.dirName || 'ERROR'} isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="_container_object">
        {/* 2. 자식 폴더 목록 */}
        {isOpen &&
          directory.subDirOIdsArr.map((subDirOId, subDirIdx) => {
            return <DirectoryRowObject key={subDirIdx} dirOId={subDirOId} />
          })}

        {/* 3. 자식 파일 목록 */}
        {isOpen &&
          directory.fileOIdsArr.map((fileOId, fileIdx) => {
            return <FileRowObject key={fileIdx} fileOId={fileOId} />
          })}
      </div>
    </div>
  )
}
