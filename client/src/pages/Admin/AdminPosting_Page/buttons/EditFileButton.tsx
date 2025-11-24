import {useCallback} from 'react'
import {useFileCallbacksContext} from '@context'
import {useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'

type EditFileButtonProps = ButtonCommonProps & {}

export const EditFileButton: FC<EditFileButtonProps> = ({className, style, ...props}) => {
  const fileContent = useBlogSelector(state => state.file.fileContent)
  const fileName = useBlogSelector(state => state.file.fileName)
  const fileOId = useBlogSelector(state => state.file.fileOId)
  const {editFile} = useFileCallbacksContext()

  const onClick = useCallback(
    (fileContent: string, fileName: string, fileOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      editFile(fileOId, fileName, fileContent)
    },
    [editFile]
  )

  return (
    <button
      className={`EditFileButton ${className || ''}`}
      onClick={onClick(fileContent, fileName, fileOId)}
      style={style}
      {...props} // ::
    >
      수정
    </button>
  )
}

