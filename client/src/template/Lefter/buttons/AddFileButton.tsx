import {useCallback} from 'react'

import {Icon} from '@component'
import {useDirectoryActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type AddFileButtonProps = DivCommonProps & {dirOId: string}

export const AddFileButton: FC<AddFileButtonProps> = ({dirOId, className, style, ...props}) => {
  const {setDirOId_addFile} = useDirectoryActions()

  const onClickIcon = useCallback(
    (_dirOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      setDirOId_addFile(_dirOId)
    },
    []
  )

  const onMouseDownIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }, [])

  return (
    <Icon
      className={`AddFileButton _icon ${className || ''}`}
      iconName="post_add"
      onClick={onClickIcon(dirOId)}
      onMouseDown={onMouseDownIcon}
      style={style}
      {...props} // ::
    />
  )
}

