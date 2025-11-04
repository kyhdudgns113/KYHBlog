import {useCallback} from 'react'
import {useFileCallbacksContext} from '@context'
import {useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import * as LT from '@localizeType'
import * as SV from '@shareValue'

type HideFileButtonProps = ButtonCommonProps

export const HideFileButton: FC<HideFileButtonProps> = ({className, style, ...props}) => {
  const file = useBlogSelector(state => state.file.file)
  const {editFileStatus} = useFileCallbacksContext()

  const isHidden = file.fileStatus === SV.FILE_HIDDEN

  const onClickHide = useCallback(
    (file: LT.FileTypeLocal) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      let newFileStatus = SV.FILE_NORMAL

      if (file.fileStatus !== SV.FILE_HIDDEN) {
        newFileStatus = SV.FILE_HIDDEN
      }

      editFileStatus(file.fileOId, newFileStatus) // ::
        .then(isSuccess => {
          if (isSuccess) {
            if (newFileStatus === SV.FILE_HIDDEN) {
              alert('숨김 설정이 완료되었습니다')
            } // ::
            else {
              alert('숨김 해제가 완료되었습니다')
            }
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`HideFileButton ${isHidden ? '_isHiddenFile' : ''} ${className || ''}`}
      onClick={onClickHide(file)}
      style={style}
      {...props} // ::
    >
      숨김
    </button>
  )
}
