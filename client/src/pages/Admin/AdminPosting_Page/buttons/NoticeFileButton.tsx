import {useCallback} from 'react'

import {useFileCallbacksContext} from '@context'
import {useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {APIReturnType} from '@type'
import * as LT from '@localizeType'
import * as SV from '@shareValue'

type NoticeFileButtonProps = ButtonCommonProps

export const NoticeFileButton: FC<NoticeFileButtonProps> = ({className, style, ...props}) => {
  const file = useBlogSelector(state => state.file.file)
  const {editFileStatus} = useFileCallbacksContext()

  const isNotice = file.fileStatus === SV.FILE_NOTICE

  const onClickNotice = useCallback(
    (file: LT.FileTypeLocal) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      let newFileStatus = SV.FILE_NORMAL

      if (file.fileStatus !== SV.FILE_NOTICE) {
        newFileStatus = SV.FILE_NOTICE
      }

      editFileStatus(file.fileOId, newFileStatus) // ::
        .then((res: APIReturnType) => {
          if (res.isSuccess) {
            if (newFileStatus === SV.FILE_NOTICE) {
              alert('공지 설정이 완료되었습니다')
            } // ::
            else {
              alert('공지 해제가 완료되었습니다')
            }
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`NoticeFileButton ${isNotice ? '_isNoticeFile' : ''} ${className || ''}`}
      onClick={onClickNotice(file)}
      style={style}
      {...props} // ::
    >
      공지
    </button>
  )
}

