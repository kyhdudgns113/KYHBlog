import {useCallback, useState} from 'react'

import {useDirectoryCallbacksContext} from '@context'
import {useBlogSelector, useDirectoryActions} from '@redux'

import type {DragEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

import './FileRowSpaceGroup.scss'

type FileRowSpaceGroupProps = DivCommonProps & {
  fileIdx: number
  parentDirOId: string
}

export const FileRowSpaceGroup: FC<FileRowSpaceGroupProps> = ({fileIdx, parentDirOId, className, ...props}) => {
  const moveDirOId = useBlogSelector(state => state.directory.moveDirOId)
  const moveFileOId = useBlogSelector(state => state.directory.moveFileOId)
  const {resetMoveFileOId} = useDirectoryActions()
  const {moveDirectory, moveFile} = useDirectoryCallbacksContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    /**
     * 파일이던 폴더든 hover 상태로 만든다
     * - 파일을 옮기는 상황이면 당연히 hover 되어 색이 변해야 한다
     * - 폴더를 옮기는 상황에도 어차피 부모 폴더의 맨 마지막으로 이동하기 때문에 hover 상태로 만들어야 한다
     */
    setIsHover(true)
  }, [])

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(false)
  }, [])

  const onDrop = useCallback(
    (parentDirOId: string, rowIdx: number, moveDirOId: string, moveFileOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (moveDirOId) {
        // 파일에 폴더를 올려놓으면 부모 폴더의 맨 마지막으으로 이동시킨다
        moveDirectory(parentDirOId, moveDirOId, null)
      } // ::
      else if (moveFileOId) {
        moveFile(parentDirOId, moveFileOId, rowIdx)
      }

      // onDrop 하면 onDragLeave 가 실행되지 않기에 여기서 이걸 해줘야 한다.
      setIsHover(false)
      resetMoveFileOId()
    },
    [moveDirectory, moveFile, resetMoveFileOId]
  )

  return (
    <div
      className={`FileRowSpace_Group ${className || ''} ${isHover ? '_hover' : ''}`}
      onDragEnter={onDragEnter}
      onDragOver={e => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop(parentDirOId, fileIdx, moveDirOId, moveFileOId)}
      {...props} // ::
    ></div>
  )
}
