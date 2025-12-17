import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAuthStatesContext} from '@context'
import {useTemplateActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './WriteQnAButton.scss'

type WriteQnAButtonProps = DivCommonProps & {}

/**
 * WriteQnAButton
 * - 글쓰기 버튼
 * - QnA 페이지에 있음
 * - QnA 작성 페이지로 이동하는 버튼
 */
export const WriteQnAButton: FC<WriteQnAButtonProps> = ({className, ...props}) => {
  const {clickLogInBtn} = useTemplateActions()

  const {isLoggedIn} = useAuthStatesContext()

  const navigate = useNavigate()

  const onClickWrite = useCallback(
    (isLoggedIn: boolean) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (!isLoggedIn) {
        clickLogInBtn()
        alert('로그인 이후 이용해주세요.')
        return
      }

      navigate('/main/qna/write')
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`WriteQnAButton ${className || ''}`} onClick={onClickWrite(isLoggedIn)} {...props}>
      글쓰기
    </div>
  )
}
