import {useEffect, useState} from 'react'
import {useBlogSelector} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './NewFile.scss'

type NewFileProps = DivCommonProps & {
  dirOId?: string
  fileOId?: string
}

export const NewFile: FC<NewFileProps> = ({dirOId, fileOId, className, style, ...props}) => {
  const directories = useBlogSelector(state => state.directory.directories)
  const fileRows = useBlogSelector(state => state.directory.fileRows)

  const [isNew, setIsNew] = useState<boolean>(false)

  useEffect(() => {
    const now = Date.now()
    const oneWeekAgo = now - SV.DATE_DIFF_NEW_FILE

    if (dirOId) {
      const directory = directories[dirOId]
      if (directory?.updatedAtFileValue) {
        setIsNew(directory.updatedAtFileValue > oneWeekAgo)
      } // ::
      else {
        setIsNew(false)
      }
    } // ::
    else if (fileOId) {
      const fileRow = fileRows[fileOId]
      if (fileRow?.updatedAtValue) {
        setIsNew(fileRow.updatedAtValue > oneWeekAgo)
      } // ::
      else {
        setIsNew(false)
      }
    } // ::
    else {
      setIsNew(false)
    }
  }, [dirOId, fileOId, directories, fileRows])

  if (!isNew) return null

  return (
    <div className={`NewFile ${className || ''}`} style={style} {...props}>
      NEW
    </div>
  )
}
