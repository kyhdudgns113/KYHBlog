import {useCallback} from 'react'

import {useAdminCallbacksContext} from '@context'
import {useAdminActions, useBlogSelector} from '@redux'

import {UsersButton} from '../../buttons'
import {UsersStatusObject} from '../../objects'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './UsersPart.scss'

type UsersPartProps = DivCommonProps & {}

export const UsersPart: FC<UsersPartProps> = ({className, style, ...props}) => {
  const isLoadingUserArr = useBlogSelector(state => state.admin.isLoadingUserArr)
  const userArr = useBlogSelector(state => state.admin.userArr)
  const {setIsLoadingUserArr} = useAdminActions()
  const {loadUserArr} = useAdminCallbacksContext()

  const onClickTitle = useCallback(
    (isLoadingUserArr: boolean | null) => (e: MouseEvent<HTMLParagraphElement>) => {
      e.stopPropagation()

      if (isLoadingUserArr) {
        alert('아직 로딩중입니다.')
        return
      }

      setIsLoadingUserArr(true)

      loadUserArr(true) // ::
        .then(ok => {
          if (ok) {
            setIsLoadingUserArr(false)
          } // ::
          else {
            setIsLoadingUserArr(null)
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`Users_Part ${className || ''}`} style={style} {...props}>
      {/* 1. 타이틀 */}
      <p className={`_title_part`} onClick={onClickTitle(isLoadingUserArr)}>
        Users
      </p>

      {/* 2, 3. 사용자 현황 */}
      <UsersStatusObject isLoadingUserArr={isLoadingUserArr} userArr={userArr} />

      {/* 4. Users 버튼 */}
      <UsersButton />
    </div>
  )
}
