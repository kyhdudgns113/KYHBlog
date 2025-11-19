import {useCallback, useState} from 'react'

import {useDirectoryCallbacksContext} from '@context'
import {useDirectoryActions} from '@redux'

import type {FC, ChangeEvent, KeyboardEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './AddDirectoryObject.scss'

type AddDirectoryObjectProps = DivCommonProps & {
  dirOId: string
}

export const AddDirectoryObject: FC<AddDirectoryObjectProps> = ({dirOId, className, ...props}) => {
  const {initDirOId_addDir} = useDirectoryActions()
  const {addDirectory} = useDirectoryCallbacksContext()

  const [dirName, setDirName] = useState<string>('')

  const onBlur = useCallback(
    (dirOId: string, dirName: string) => () => {
      initDirOId_addDir()

      if (!dirName.trim()) {
        return
      }

      addDirectory(dirOId, dirName.trim())
    },
    []
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDirName(e.target.value)
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onBlur(dirOId, dirName)()
      }
    },
    [onBlur, dirOId, dirName]
  )

  return (
    <div className={`AddDirectory_Object _module ${className || ''}`} {...props}>
      <input
        autoFocus
        className="_dir"
        onBlur={onBlur(dirOId, dirName)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={dirName} // ::
      />
    </div>
  )
}
