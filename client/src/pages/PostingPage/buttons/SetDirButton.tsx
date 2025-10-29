import {useCallback} from 'react'
import {Icon} from '@component'
import {useDirectoryActions, useModalActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type SetDirButtonProps = DivCommonProps & {
  dirOId: string
}

export const SetDirButton: FC<SetDirButtonProps> = ({dirOId, className, style, ...props}) => {
  const {openEditDirModal} = useModalActions()
  const {setDirOId_editDir} = useDirectoryActions()

  const onClickIcon = useCallback(
    (dirOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      e.preventDefault()
      openEditDirModal()
      setDirOId_editDir(dirOId)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Icon
      className={`SetDirButton _icon ${dirOId} ${className || ''}`}
      iconName="settings"
      onClick={onClickIcon(dirOId)}
      style={style}
      {...props} // ::
    />
  )
}
