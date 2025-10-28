import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {FileInfoGroup} from '../groups'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Obj_FileRow.scss'

type FileRowObjectProps = DivCommonProps & {fileOId: string}

export const FileRowObject: FC<FileRowObjectProps> = ({fileOId, className, ...props}) => {
  const navigate = useNavigate()

  const onClickFileRow = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    navigate(`/main/reading/${fileOId}`)
  }, []) // eslint-disable-line

  return (
    <div className={`FileRow_Object ${className || ''}`} onClick={onClickFileRow} {...props}>
      <FileInfoGroup fileOId={fileOId} />
    </div>
  )
}
