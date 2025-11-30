import {useCallback} from 'react'
import {Icon} from '@component'
import {useDirectoryActions, useModalActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type SetFileButtonProps = DivCommonProps & {
  fileOId: string
}

export const SetFileButton: FC<SetFileButtonProps> = ({fileOId, className, style, ...props}) => {
  const {openEditFileModal} = useModalActions()
  const {setFileOId_editFile} = useDirectoryActions()

  const onClickIcon = useCallback(
    (fileOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      e.preventDefault()
      openEditFileModal()
      setFileOId_editFile(fileOId)
    },
    []
  )

  return (
    <Icon
      className={`SetFileButton _icon ${fileOId} ${className || ''}`}
      iconName="settings"
      onClick={onClickIcon(fileOId)}
      style={style}
      {...props} // ::
    />
  )
}
