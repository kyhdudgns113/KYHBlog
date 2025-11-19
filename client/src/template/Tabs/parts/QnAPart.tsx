import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

type QnAPartProps = DivCommonProps & {}

export const QnAPart: FC<QnAPartProps> = ({...props}) => {
  const nowTab = useBlogSelector(state => state.template.nowTab)

  const navigate = useNavigate()

  const onClickTab = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    navigate('/main/qna')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`QnA_Part _part_common ${nowTab === 'qna' ? '_selected' : ''}`} onClick={onClickTab} {...props}>
      Q&A
    </div>
  )
}
