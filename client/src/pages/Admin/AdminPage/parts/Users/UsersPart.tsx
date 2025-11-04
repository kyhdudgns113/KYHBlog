import {useCallback, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAdminCallbacksContext} from '@context'
import {Icon} from '@component'
import {useAdminActions, useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {UserType} from '@shareType'

import * as A from '../../addons'

import './UsersPart.scss'

type UsersPartProps = DivCommonProps & {}

export const UsersPart: FC<UsersPartProps> = ({className, style, ...props}) => {
  const isLoadingUserArr = useBlogSelector(state => state.admin.isLoadingUserArr)
  const userArr = useBlogSelector(state => state.admin.userArr)
  const {setIsLoadingUserArr} = useAdminActions()
  const {loadUserArr} = useAdminCallbacksContext()

  const [newUserArr, setNewUserArr] = useState<UserType[]>([])

  const navigate = useNavigate()

  const onClickTitle = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation()

    navigate('/main/admin/users')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onClickRefresh = useCallback(
    (isLoadingUserArr: boolean | null) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()

      if (isLoadingUserArr) {
        alert('아직 로딩중입니다.')
        return
      }

      setIsLoadingUserArr(true)

      loadUserArr(true) // ::
        .then(ok => {
          setIsLoadingUserArr(false)
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

  // 초기화: 신규유저 배열 초기화(1주일 이내 생성시)
  useEffect(() => {
    const nowDate = new Date()
    const newArr = userArr.filter(user => {
      const userDate = new Date(user.createdAt)
      const diffTime = Math.abs(nowDate.getTime() - userDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    })
    setNewUserArr(newArr)
  }, [userArr])

  return (
    <div className={`UsersPart _admin_part ${className || ''}`} style={style} {...props}>
      {/* 1. 타이틀 */}
      <div className="_part_title">
        <p className="_part_title_text" onClick={onClickTitle}>
          Users
        </p>
        <Icon className="_part_title_icon" iconName="refresh" onClick={onClickRefresh(isLoadingUserArr)} />
      </div>

      {isLoadingUserArr && <p>Loading...</p>}
      {isLoadingUserArr === null && <A.LoadingError />}

      {/* 2. 전체 유저수 */}
      <p className="_part_content">전체 유저수: {userArr.length}</p>

      {/* 3. 신규 유저 수 (1주일 이내 생성시) */}
      <p className="_part_content">신규유저 수: {newUserArr.length}</p>
    </div>
  )
}
