import {useCallback} from 'react'

import {Icon} from '@component'
import {useDirectoryActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AddDirButtonProps = DivCommonProps & {dirOId: string}

export const AddDirButton: FC<AddDirButtonProps> = ({dirOId, className, style, ...props}) => {
  const {setDirOId_addDir} = useDirectoryActions()

  const onClickIcon = useCallback(
    (_dirOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      setDirOId_addDir(_dirOId)
    },
    []
  )

  const onMouseDownIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }, [])

  return (
    <Icon
      className={`AddDirButton _icon ${className || ''}`}
      iconName="create_new_folder"
      onClick={onClickIcon(dirOId)}
      onMouseDown={onMouseDownIcon}
      style={style}
      {...props} // ::
    />
  )
}
