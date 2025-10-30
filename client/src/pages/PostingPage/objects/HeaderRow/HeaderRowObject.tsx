import {useCallback} from 'react'

import {useDirectoryActions, useDirectoryStates} from '@redux'

import {AddDirButton, AddFileButton, RefreshButton} from '../../buttons'

import type {DragEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderRowObject.scss'

type HeaderRowObjectProps = DivCommonProps & {}

export const HeaderRowObject: FC<HeaderRowObjectProps> = ({className, ...props}) => {
  const {rootDirOId} = useDirectoryStates()
  const {resetMoveDirOId} = useDirectoryActions()

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    /**
     * ManagaDirectoryPart 에서 onDrop 을 쓰는데, 여기서는 그게 적용되면 안된다
     */
    e.stopPropagation()

    resetMoveDirOId()
  }, [])

  return (
    <div
      className={`HeaderRow_Object ${className || ''}`}
      onDrop={onDrop}
      {...props} // ::
    >
      <AddDirButton dirOId={rootDirOId} style={{marginLeft: 'auto'}} />
      <AddFileButton dirOId={rootDirOId} />
      <RefreshButton />
    </div>
  )
}
