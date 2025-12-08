import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useBlogSelector} from '@redux'
import {useQnACallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as T from '@type'

import './DeleteQnAButton.scss'

type DeleteQnAButtonProps = DivCommonProps & {}

export const DeleteQnAButton: FC<DeleteQnAButtonProps> = ({className, ...props}) => {
  const qnA = useBlogSelector(state => state.qna.qnA)
  const {deleteQnA} = useQnACallbacksContext()
  const navigate = useNavigate()

  const onClickDelete = useCallback(
    (qnAOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (!window.confirm('정말 삭제하시겠습니까?')) {
        return
      }

      deleteQnA(qnAOId) // ::
        .then((res: T.APIReturnType) => {
          const {isSuccess} = res
          if (isSuccess) {
            navigate('/main/qna')
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`DeleteQnAButton ${className || ''}`} onClick={onClickDelete(qnA.qnAOId)} {...props}>
      삭제
    </div>
  )
}
