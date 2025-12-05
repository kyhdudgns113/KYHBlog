import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './EditQnAButton.scss'

type EditQnAButtonProps = DivCommonProps & {}

export const EditQnAButton: FC<EditQnAButtonProps> = ({className, ...props}) => {
  const qnA = useBlogSelector(state => state.qna.qnA)
  const navigate = useNavigate()

  const onClickEdit = useCallback(
    (qnAOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      navigate(`/main/qna/edit/${qnAOId}`)
    },
    [navigate]
  )

  return (
    <div className={`EditQnAButton ${className || ''}`} onClick={onClickEdit(qnA.qnAOId)} {...props}>
      수정
    </div>
  )
}
