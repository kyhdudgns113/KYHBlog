import {useEffect, useState} from 'react'
import {NULL_USER} from '@nullValue'
import {useAuthStatesContext, useUserCallbacksContext} from '@context'

import type {FC} from 'react'
import type {CommentType, UserType} from '@shareType'
import type {DivCommonProps} from '@prop'
import {ChatUserButton} from '../buttons'

import './_styles/CommentUserInfoE.scss'

type CommentUserInfoEProps = DivCommonProps & {comment: CommentType}

export const CommentUserInfoE: FC<CommentUserInfoEProps> = ({comment, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const {loadUserInfo} = useUserCallbacksContext()

  const [targetUser, setTargetUser] = useState<UserType>(NULL_USER)

  const isMyComment = userOId === comment.userOId

  // 초기화: targetUser
  useEffect(() => {
    const {userOId, userName} = comment
    if (userOId) {
      loadUserInfo(comment.userOId, setTargetUser) // ::
        .then(ok => {
          if (!ok) {
            const createdAt = new Date()
            const updatedAt = createdAt
            setTargetUser({
              createdAt,
              updatedAt,
              userOId,
              userName,
              userMail: 'NULL',
              userId: 'NULL',
              picture: 'NULL',
              signUpType: 'common',
              userAuth: 0
            })
          }
        })
    }
  }, [comment]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`CommentUserInfo_E ${className || ''}`}
      onClick={e => e.stopPropagation()}
      style={style}
      {...props} // ::
    >
      <div className="__row_name_id">
        <b className="__info_name">{targetUser.userName}</b>
        <b className="__info_id">{`(${targetUser.userId})`}</b>
      </div>
      <div className="__row_mail">
        <p className="__info_mail">{targetUser.userMail}</p>
      </div>
      <div className="__row_button">{!isMyComment && <ChatUserButton targetUserOId={targetUser.userOId} />}</div>
    </div>
  )
}
