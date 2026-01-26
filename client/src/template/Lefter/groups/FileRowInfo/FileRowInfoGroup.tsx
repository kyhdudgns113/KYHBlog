import {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'
import {useDirectoryCallbacksContext} from '@context'
import {useBlogSelector, useDirectoryActions} from '@redux'

import {FileStatus} from '../../components'
import {SetFileButton} from '../../buttons'

import type {FC, MouseEvent, DragEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './FileRowInfoGroup.scss'

type FileRowInfoGroupProps = DivCommonProps & {
  fileIdx: number
  fileOId: string
  parentDirOId: string
}

export const FileRowInfoGroup: FC<FileRowInfoGroupProps> = ({fileIdx, fileOId, parentDirOId, className, ...props}) => {
  const fileRows = useBlogSelector(state => state.directory.fileRows)
  const moveDirOId = useBlogSelector(state => state.directory.moveDirOId)
  const moveFileOId = useBlogSelector(state => state.directory.moveFileOId)
  const {resetMoveFileOId, setMoveFileOId} = useDirectoryActions()

  const {moveDirectory, moveFile} = useDirectoryCallbacksContext()

  const navigate = useNavigate()

  const [isHover, setIsHover] = useState<boolean>(false)

  // AREA1: Event Listners

  const onClick = useCallback(
    (fileOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      navigate(`/main/admin/posting/${fileOId}`)
    },
    [navigate]
  )

  const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(true)
  }, [])

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(false)
  }, [])

  const onDragStart = useCallback(
    (fileOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setMoveFileOId(fileOId)
    },
    [setMoveFileOId]
  )

  const onDrop = useCallback(
    (parentDirOId: string, fileIdx: number) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (moveDirOId) {
        moveDirectory(parentDirOId, moveDirOId, null)
      } // ::
      else if (moveFileOId) {
        moveFile(parentDirOId, moveFileOId, fileIdx + 1)
      }

      // onDrop 하면 onDragLeave 가 실행되지 않기에 여기서 이걸 해줘야 한다.
      setIsHover(false)
      resetMoveFileOId()
    },
    [moveDirOId, moveFileOId, moveDirectory, moveFile, resetMoveFileOId]
  )

  return (
    <div
      className={`FileRowInfo_Group ${className || ''} ${isHover ? '_hover' : ''}`}
      draggable
      onClick={onClick(fileOId)}
      onDragEnter={onDragEnter}
      onDragOver={e => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDragStart={onDragStart(fileOId)}
      onDrop={onDrop(parentDirOId, fileIdx)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...props}
    >
      <Icon iconName="article" style={{fontSize: '22px', marginRight: '4px'}} />
      {fileRows[fileOId]?.fileName || 'ERROR'}

      <FileStatus fileOId={fileOId} />

      {isHover && <SetFileButton fileOId={fileOId} style={{marginLeft: 'auto', marginRight: '4px'}} />}
    </div>
  )
}
