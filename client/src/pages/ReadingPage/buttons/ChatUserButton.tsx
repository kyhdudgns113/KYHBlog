import {useCallback} from 'react'
import {Icon} from '@component'
import {useAuthStatesContext, useChatCallbacksContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type ChatUserButtonProps = DivCommonProps & {
  targetUserOId: string
}

export const ChatUserButton: FC<ChatUserButtonProps> = ({targetUserOId, className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const {loadUserChatRoom} = useChatCallbacksContext()

  const onClickIcon = useCallback(
    (userOId: string, targetUserOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      e.preventDefault()

      if (!userOId) {
        alert('로그인 이후 이용해주세요.')
        return
      }

      if (userOId !== targetUserOId) {
        loadUserChatRoom(userOId, targetUserOId)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Icon
      className={`ChatUserButton _btn ${className || ''}`}
      iconName="mail"
      onClick={onClickIcon(userOId, targetUserOId)}
      style={style}
      {...props} // ::
    />
  )
}
