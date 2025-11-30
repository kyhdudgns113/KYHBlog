import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useBlogSelector, useFileActions} from '@redux'

import {FileHeaderObject, FileContentsObject, CheckDeleteObject} from './objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './AdminPostingPage.scss'

type AdminPostingPageProps = DivCommonProps & {}

export const AdminPostingPage: FC<AdminPostingPageProps> = ({className, ...props}) => {
  const fileOId = useBlogSelector(state => state.file.fileOId)
  const isDelete = useBlogSelector(state => state.file.isDelete)
  const {resetFileOId, setFileOId} = useFileActions()

  const location = useLocation()

  // 초기화: fileOId from url
  useEffect(() => {
    const newFileOId = location.pathname.split('/main/admin/posting/')[1]
    if (newFileOId) {
      setFileOId(newFileOId)
    } // ::
    else {
      resetFileOId()
    }
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!fileOId) return null

  return (
    <div className={`AdminPostingPage ${className || ''}`} {...props}>
      <div className="_editingFilePart">
        <FileHeaderObject />
        <FileContentsObject />

        {isDelete && <CheckDeleteObject />}
      </div>
    </div>
  )
}
