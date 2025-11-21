import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {FileInfoGroup} from '../../groups'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './FileRowObj.scss'

type FileRowObjProps = DivCommonProps & {fileOId: string}

export const FileRowObj: FC<FileRowObjProps> = ({fileOId, className, ...props}) => {
  const navigate = useNavigate()

  const onClickFileRow = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    navigate(`/main/blog/${fileOId}`)
  }, []) // eslint-disable-line

  return (
    <div className={`FileRow_Obj ${className || ''}`} onClick={onClickFileRow} {...props}>
      <FileInfoGroup fileOId={fileOId} />
    </div>
  )
}
