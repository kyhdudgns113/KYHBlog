import {useCallback, useState} from 'react'

import {Icon} from '@component'
import {useDirectoryCallbacksContext} from '@context'
import {useBlogSelector, useDirectoryActions} from '@redux'

import {AddDirButton, AddFileButton, SetDirButton} from '../../buttons'

import type {FC, MouseEvent, DragEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {DirectoryType} from '@shareType'
import type {Setter} from '@type'

import './DirectoryInfoGroup.scss'

type DirectoryInfoGroupProps = DivCommonProps & {
  /**
   * dirOId 는 부모로부터 받아와서 값이 있는데 directory 는 아직 안 들어왔을수도 있다
   * 둘 다 받아온다
   */
  directory: DirectoryType
  dirOId: string
  isOpen: boolean
  setIsOpen: Setter<boolean>
}

export const DirectoryInfoGroup: FC<DirectoryInfoGroupProps> = ({directory, dirOId, isOpen, setIsOpen, className, ...props}) => {
  const moveDirOId = useBlogSelector(state => state.directory.moveDirOId)
  const moveFileOId = useBlogSelector(state => state.directory.moveFileOId)
  const {setMoveDirOId, setMoveFileOId} = useDirectoryActions()
  const {moveDirectory, moveFile} = useDirectoryCallbacksContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  // AREA1: Event Listners

  const onClickToggle = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      e.preventDefault()
      setIsOpen(prev => !prev)
    },
    [setIsOpen]
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
    (dirOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setMoveDirOId(dirOId)
    },
    []
  )

  const onDrop = useCallback(
    (dirOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (moveDirOId) {
        moveDirectory(dirOId, moveDirOId, null)
      } // ::
      else if (moveFileOId) {
        moveFile(dirOId, moveFileOId, null)
      }
      setMoveFileOId('')

      // onDrop 하면 onDragLeave 가 실행되지 않기에 여기서 이걸 해줘야 한다.
      setIsHover(false)
    },
    [moveDirOId, moveFileOId, moveDirectory, moveFile]
  )

  return (
    <div
      className={`DirectoryInfo_Group ${className || ''}`}
      draggable
      onClick={onClickToggle}
      onDragEnter={onDragEnter}
      onDragOver={e => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDragStart={onDragStart(dirOId)}
      onDrop={onDrop(dirOId)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...props}
    >
      {isOpen && <Icon draggable={false} iconName="arrow_drop_down" style={{fontSize: '30px'}} />}
      {!isOpen && <Icon draggable={false} iconName="arrow_right" style={{fontSize: '30px'}} />}

      <p className={`_title_group`}> {directory?.dirName || '???'}</p>

      {isHover && isOpen && (
        <>
          <AddDirButton className={`_icon_row`} dirOId={dirOId} style={{marginLeft: 'auto'}} />
          <AddFileButton className={`_icon_row`} dirOId={dirOId} style={{marginLeft: '4px'}} />
          <SetDirButton className={`_icon_row`} dirOId={dirOId} style={{marginLeft: '4px'}} />
        </>
      )}
    </div>
  )
}
