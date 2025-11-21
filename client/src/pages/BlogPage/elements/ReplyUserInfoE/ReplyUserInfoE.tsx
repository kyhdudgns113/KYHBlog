import {useEffect, useState} from 'react'

import {useAuthStatesContext, useUserCallbacksContext} from '@context'

import {ChatUserButton} from '../../buttons'

import type {FC} from 'react'
import type {UserTypeLocal} from '@localizeType'
import type {DivCommonProps} from '@prop'
import * as LT from '@localizeType'

import * as NV from '@nullValue'

import './ReplyUserInfoE.scss'

type ReplyUserInfoEProps = DivCommonProps & {reply: LT.ReplyTypeLocal}

export const ReplyUserInfoE: FC<ReplyUserInfoEProps> = ({reply, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const {loadUserInfo} = useUserCallbacksContext()

  const [targetUser, setTargetUser] = useState<UserTypeLocal>(NV.NULL_USER())

  const isMyReply = userOId === reply.userOId

  // 초기화: targetUser
  useEffect(() => {
    const {userOId, userName} = reply
    if (userOId) {
      loadUserInfo(reply.userOId, setTargetUser) // ::
        .then(ok => {
          if (!ok) {
            const createdAtValue = Date.now()
            const updatedAtValue = createdAtValue
            setTargetUser({
              createdAtValue: new Date(createdAtValue).valueOf(),
              updatedAtValue: new Date(updatedAtValue).valueOf(),
              userAuth: 0,
              userId: 'NULL',
              userMail: 'NULL',
              userName,
              userOId
            } as LT.UserTypeLocal)
          }
        })
    }
  }, [reply]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`ReplyUserInfo_E ${className || ''}`}
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
      <div className="__row_button">{!isMyReply && <ChatUserButton targetUserOId={targetUser.userOId} />}</div>
    </div>
  )
}

