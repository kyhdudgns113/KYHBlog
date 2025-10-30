import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import {useFileActions, useFileStates} from '@redux'

import {FileHeaderObject, FileContentsObject, CheckDeleteObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './EditingFilePart.scss'

type EditingFilePartProps = DivCommonProps & {}

export const EditingFilePart: FC<EditingFilePartProps> = ({className, ...props}) => {
  const {fileOId, isDelete} = useFileStates()
  const {resetFileOId, setFileOId} = useFileActions()

  const location = useLocation()

  // 초기화: fileOId from url
  useEffect(() => {
    const newFileOId = location.pathname.split('/main/posting/')[1]
    if (newFileOId) {
      setFileOId(newFileOId)
    } // ::
    else {
      resetFileOId()
    }
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!fileOId) return null

  return (
    <div className={`EditingFile_Part ${className || ''}`} {...props}>
      <FileHeaderObject />
      <FileContentsObject />

      {isDelete && <CheckDeleteObject />}
    </div>
  )
}
