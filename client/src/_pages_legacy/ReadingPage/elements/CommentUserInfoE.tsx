import {useEffect, useState} from 'react'

import {useAuthStatesContext, useUserCallbacksContext} from '@context'

import {ChatUserButton} from '../buttons'

import type {FC} from 'react'
import type {UserTypeLocal} from '@localizeType'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import * as NV from '@nullValue'

import './_styles/CommentUserInfoE.scss'

type CommentUserInfoEProps = DivCommonProps & {comment: LT.CommentTypeLocal}

export const CommentUserInfoE: FC<CommentUserInfoEProps> = ({comment, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const {loadUserInfo} = useUserCallbacksContext()

  const [targetUser, setTargetUser] = useState<UserTypeLocal>(NV.NULL_USER())

  const isMyComment = userOId === comment.userOId

  // 초기화: targetUser
  useEffect(() => {
    const {userOId, userName} = comment
    if (userOId) {
      loadUserInfo(comment.userOId, setTargetUser) // ::
        .then(ok => {
          if (!ok) {
            alert('에러가 떴다고?')
            const createdAtValue = Date.now()
            const updatedAtValue = createdAtValue
            setTargetUser({
              createdAtValue: new Date(createdAtValue).valueOf(),
              updatedAtValue: new Date(updatedAtValue).valueOf(),
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
      <div className={`__row_name_id`}>
        <b className={`__info_name`}>{targetUser.userName}</b>
        <b className={`__info_id`}>{`(${targetUser.userId})`}</b>
      </div>
      <div className={`__row_mail`}>
        <p className={`__info_mail`}>{targetUser.userMail}</p>
      </div>
      <div className={`__row_button`}>{!isMyComment && <ChatUserButton targetUserOId={targetUser.userOId} />}</div>
    </div>
  )
}
