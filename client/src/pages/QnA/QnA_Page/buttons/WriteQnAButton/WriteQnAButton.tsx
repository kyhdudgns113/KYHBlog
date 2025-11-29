import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './WriteQnAButton.scss'

type WriteQnAButtonProps = DivCommonProps & {}

export const WriteQnAButton: FC<WriteQnAButtonProps> = ({className, ...props}) => {
  const onClickWrite = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    // TODO: 질문 작성 페이지로 이동
  }, [])

  return (
    <div className={`WriteQnAButton ${className || ''}`} onClick={onClickWrite} {...props}>
      글쓰기
    </div>
  )
}
