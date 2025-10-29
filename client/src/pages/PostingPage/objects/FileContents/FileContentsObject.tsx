import {useCallback} from 'react'

import {useFileCallbacksContext} from '@context'
import {useFileActions, useFileStates} from '@redux'

import type {ChangeEvent, FC, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './FileContentsObject.scss'

type FileContentsObjectProps = DivCommonProps & {}

export const FileContentsObject: FC<FileContentsObjectProps> = ({className, ...props}) => {
  const {fileContent, fileName, fileOId} = useFileStates()
  const {setFileContent} = useFileActions()
  const {editFile} = useFileCallbacksContext()

  const onChangeContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDownContent = useCallback(
    (content: string, fileName: string, fileOId: string) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault()
        e.stopPropagation()

        editFile(fileOId, fileName, content)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`FileContents_Object ${className || ''}`} {...props}>
      <textarea
        onChange={onChangeContent}
        onKeyDown={onKeyDownContent(fileContent, fileName, fileOId)}
        value={fileContent} // ::
      />
    </div>
  )
}
