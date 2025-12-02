import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './WriteQnAButton.scss'

type WriteQnAButtonProps = DivCommonProps & {}

export const WriteQnAButton: FC<WriteQnAButtonProps> = ({className, ...props}) => {
  const navigate = useNavigate()

  const onClickWrite = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    navigate('/main/qna/write')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`WriteQnAButton ${className || ''}`} onClick={onClickWrite} {...props}>
      글쓰기
    </div>
  )
}
