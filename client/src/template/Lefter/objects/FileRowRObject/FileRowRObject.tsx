import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {FileInfoGroup} from '../../groups'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './FileRowRObject.scss'

type FileRowRObjectProps = DivCommonProps & {fileOId: string}

export const FileRowRObject: FC<FileRowRObjectProps> = ({fileOId, className, ...props}) => {
  const navigate = useNavigate()

  const onClickFileRow = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    navigate(`/main/blog/${fileOId}`)
  }, []) // eslint-disable-line

  return (
    <div className={`FileRow_RObject ${className || ''}`} onClick={onClickFileRow} {...props}>
      <FileInfoGroup fileOId={fileOId} />
    </div>
  )
}

