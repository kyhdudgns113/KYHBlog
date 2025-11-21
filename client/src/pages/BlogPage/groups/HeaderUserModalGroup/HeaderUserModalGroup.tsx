import {useCallback} from 'react'

import {useAuthStatesContext} from '@context'
import {useBlogSelector} from '@redux'

import {ChatUserButton} from '../../buttons'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderUserModalGroup.scss'

type HeaderUserModalGroupProps = DivCommonProps

/**
 * 파일 작성자 클릭시 나오는 모달
 *
 * 구성
 *   1. 유저 이름, 유저 아이디
 *   2. 유저 이메일
 *   3. 액션 버튼
 */
export const HeaderUserModalGroup: FC<HeaderUserModalGroupProps> = ({className, style, ...props}) => {
  const {userOId} = useAuthStatesContext()
  const fileUser = useBlogSelector(state => state.file.fileUser)

  const onClickDiv = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }, [])

  return (
    <div
      className={`HeaderUserModal_Group ${className || ''}`}
      onClick={onClickDiv}
      style={style}
      {...props} // ::
    >
      {/* 1. 유저 이름, 유저 아이디 */}
      <div className="__userNameId">
        <p className="__userName">{`${fileUser.userName}`}</p>
        <p className="__userId">{`${fileUser.userId}`}</p>
      </div>

      {/* 2. 유저 이메일 */}
      <p className="__userMail">{fileUser.userMail}</p>

      {/* 3. 액션 버튼 */}
      <div className="__btn_row">{userOId !== fileUser.userOId && <ChatUserButton targetUserOId={fileUser.userOId} />}</div>
    </div>
  )
}

