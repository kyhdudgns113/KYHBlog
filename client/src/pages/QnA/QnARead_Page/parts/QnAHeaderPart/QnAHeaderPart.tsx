import {useAuthStatesContext} from '@context'
import {useBlogSelector} from '@redux'
import {AUTH_ADMIN} from '@shareValue'

import {HeaderBtnRowObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnAHeaderPart.scss'

type QnAHeaderPartProps = DivCommonProps

export const QnAHeaderPart: FC<QnAHeaderPartProps> = ({...props}) => {
  const qnA = useBlogSelector(state => state.qna.qnA)
  const {userOId, userAuth} = useAuthStatesContext()

  const isOwner = qnA.userOId === userOId
  const isAdmin = userAuth === AUTH_ADMIN
  const canEdit = isOwner || isAdmin

  return (
    <div className={`QnAHeader_Part`} {...props}>
      {/* 1. 제목 */}
      <div className="_title_wrapper">
        <h1 className="_title">{qnA.title}</h1>
      </div>

      {/* 2. 작성자 정보 및 버튼 */}
      <div className="_info_wrapper">
        <div className="_author_info">
          <span className="_author_name">작성자: {qnA.userName}</span>
          {qnA.isPrivate && <span className="_private_badge">비공개</span>}
        </div>

        {canEdit && <HeaderBtnRowObject />}
      </div>

      <div className={`_bottomLine`} />
    </div>
  )
}
