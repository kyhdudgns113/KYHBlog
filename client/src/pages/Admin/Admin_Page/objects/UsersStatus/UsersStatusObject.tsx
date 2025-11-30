import {useEffect, useState} from 'react'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {UserType} from '@shareType'

import './UsersStatusObject.scss'

type UsersStatusObjectProps = DivCommonProps & {
  isLoadingUserArr: boolean | null
  userArr: UserType[]
}

export const UsersStatusObject: FC<UsersStatusObjectProps> = ({isLoadingUserArr, userArr, className, style, ...props}) => {
  const [newUserArr, setNewUserArr] = useState<UserType[]>([])

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
    <div className={`UsersStatus_Object ${className || ''}`} onClick={e => e.stopPropagation()} style={style} {...props}>
      {/* 2. 로딩 상태 */}
      {isLoadingUserArr && <p className={`_part_content`}>Loading...</p>}
      {isLoadingUserArr === null && <p className={`_part_content`}>Loading Error</p>}

      {/* 3. 전체 유저수 */}
      {!isLoadingUserArr && isLoadingUserArr !== null && (
        <>
          <p className={`_part_content`}>전체 유저수: {userArr.length}</p>
          <p className={`_part_content`}>신규유저 수: {newUserArr.length}</p>
        </>
      )}
    </div>
  )
}
