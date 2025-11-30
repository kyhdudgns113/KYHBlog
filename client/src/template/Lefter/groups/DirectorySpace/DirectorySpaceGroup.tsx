import {useCallback, useState} from 'react'

import {useDirectoryCallbacksContext} from '@context'
import {useBlogSelector, useDirectoryActions} from '@redux'

import type {DragEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

import './DirectorySpaceGroup.scss'

type DirectorySpaceGroupProps = DivCommonProps & {
  parentDirOId: string
  rowIdx: number
}

export const DirectorySpaceGroup: FC<DirectorySpaceGroupProps> = ({parentDirOId, rowIdx, className, ...props}) => {
  const moveDirOId = useBlogSelector(state => state.directory.moveDirOId)
  const moveFileOId = useBlogSelector(state => state.directory.moveFileOId)
  const {resetMoveDirOId} = useDirectoryActions()
  const {moveDirectory, moveFile} = useDirectoryCallbacksContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const onDragEnter = useCallback(
    (moveDirOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      // 폴더를 옮길때만 hover 상태로 만든다
      setIsHover(moveDirOId ? true : false)
    },
    []
  )

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(false)
  }, [])

  const onDrop = useCallback(
    (parentDirOId: string, rowIdx: number, moveDirOId: string, moveFileOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (moveDirOId) {
        moveDirectory(parentDirOId, moveDirOId, rowIdx)
      } // ::
      else if (moveFileOId) {
        moveFile(parentDirOId, moveFileOId, rowIdx)
      }

      // onDrop 하면 onDragLeave 가 실행되지 않기에 여기서 이걸 해줘야 한다.
      setIsHover(false)
      resetMoveDirOId()
    },
    [moveDirectory, moveFile, resetMoveDirOId]
  )

  return (
    <div
      className={`DirectorySpace_Group ${className || ''} ${isHover ? '_hover' : ''}`}
      onDragEnter={onDragEnter(moveDirOId)}
      onDragOver={e => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop(parentDirOId, rowIdx, moveDirOId, moveFileOId)}
      {...props} // ::
    ></div>
  )
}

