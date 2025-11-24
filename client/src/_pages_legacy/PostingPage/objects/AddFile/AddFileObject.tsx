import {useCallback, useState} from 'react'

import {useDirectoryCallbacksContext} from '@context'
import {useDirectoryActions} from '@redux'

import type {ChangeEvent, FC, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './AddFileObject.scss'

type AddFileObjectProps = DivCommonProps & {
  dirOId: string
}

export const AddFileObject: FC<AddFileObjectProps> = ({dirOId, className, ...props}) => {
  const {initDirOId_addFile} = useDirectoryActions()
  const {addFile} = useDirectoryCallbacksContext()

  const [fileName, setFileName] = useState<string>('')

  const onBlur = useCallback(
    (dirOId: string, fileName: string) => () => {
      initDirOId_addFile()

      if (!fileName.trim()) {
        return
      }

      addFile(dirOId, fileName.trim())
    },
    [addFile, initDirOId_addFile]
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value)
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onBlur(dirOId, fileName)()
      }
    },
    [onBlur, dirOId, fileName]
  )

  return (
    <div className={`AddFile_Object _module ${className || ''}`} {...props}>
      <input
        autoFocus
        className={`_file`}
        onBlur={onBlur(dirOId, fileName)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={fileName} // ::
      />
    </div>
  )
}
