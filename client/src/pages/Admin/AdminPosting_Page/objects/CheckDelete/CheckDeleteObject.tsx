import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useDirectoryCallbacksContext} from '@context'
import {useBlogSelector, useFileActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './CheckDeleteObject.scss'

type CheckDeleteObjectProps = DivCommonProps & {}

export const CheckDeleteObject: FC<CheckDeleteObjectProps> = ({className, ...props}) => {
  const fileOId = useBlogSelector(state => state.file.fileOId)
  const {offDeleteFile} = useFileActions()
  const {deleteFile} = useDirectoryCallbacksContext()

  const navigate = useNavigate()

  const onClickDelete = useCallback(
    (fileOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      deleteFile(fileOId) // ::
        .then(() => {
          navigate('/main/admin/posting')
        })
        .finally(() => {
          offDeleteFile()
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onClickCancel = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    offDeleteFile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`CheckDelete_Object ${className || ''}`} {...props}>
      <p className={`_title_object`} style={{fontSize: '22px', fontWeight: '700'}}>
        삭제하나요?
      </p>

      <div className={`_btn_row_object`}>
        <button onClick={onClickDelete(fileOId)}>삭제</button>
        <button onClick={onClickCancel}>취소</button>
      </div>
    </div>
  )
}
