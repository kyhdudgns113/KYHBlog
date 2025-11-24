import {FileRowInfoGroup, FileRowSpaceGroup} from '../../groups'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './FileRowPObject.scss'

type FileRowPObjectProps = DivCommonProps & {
  fileIdx: number
  fileOId: string
  parentDirOId: string
}

export const FileRowPObject: FC<FileRowPObjectProps> = ({fileIdx, fileOId, parentDirOId, className, ...props}) => {
  return (
    <div className={`FileRow_PObject ${className || ''}`} onDragOver={e => e.preventDefault()} {...props}>
      {/* 1. 파일 이동용 공간(fileIdx 0 일때) */}
      {fileIdx === 0 && <FileRowSpaceGroup parentDirOId={parentDirOId} fileIdx={fileIdx} />}

      {/* 2. 자신의 정보, 버튼들 */}
      <FileRowInfoGroup fileIdx={fileIdx} fileOId={fileOId} parentDirOId={parentDirOId} />

      {/* 3. 파일 이동용 공간(fileIdx 무관) */}
      <FileRowSpaceGroup parentDirOId={parentDirOId} fileIdx={fileIdx + 1} />
    </div>
  )
}

