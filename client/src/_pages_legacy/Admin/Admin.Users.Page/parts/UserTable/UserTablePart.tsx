import {useCallback} from 'react'

import {useAdminActions, useBlogSelector} from '@redux'
import {ADMIN_USER_PER_PAGE} from '@value'

import type {FC, MouseEvent} from 'react'
import type {TableCommonProps} from '@prop'

import './UserTablePart.scss'

type UserTablePartProps = TableCommonProps & {
  pageIdx: number
}

export const UserTablePart: FC<UserTablePartProps> = ({pageIdx, className, style, ...props}) => {
  const userArrFiltered = useBlogSelector(state => state.admin.userArrFiltered)
  const userArrSortType = useBlogSelector(state => state.admin.userArrSortType)
  const {sortUserArrFiltered} = useAdminActions()

  const onClickTh = useCallback(
    (prevSortType: string, sortType: string) => (e: MouseEvent<HTMLTableCellElement>) => {
      e.stopPropagation()

      sortUserArrFiltered(prevSortType, sortType)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className={`UserTable_Part ${className || ''}`} style={style} {...props}>
      <table className={`_table`}>
        <thead>
          <tr>
            <th className={`_th_id`} onClick={onClickTh(userArrSortType, 'userId')}>
              ID
            </th>
            <th className={`_th_name`} onClick={onClickTh(userArrSortType, 'userName')}>
              Name
            </th>
            <th className={`_th_email`} onClick={onClickTh(userArrSortType, 'userMail')}>
              Email
            </th>
            <th className={`_th_createdAt`} onClick={onClickTh(userArrSortType, 'createdAt')}>
              가입일
            </th>
          </tr>
        </thead>
        <tbody>
          {userArrFiltered.map((user, userIdx) => {
            if (userIdx < pageIdx * ADMIN_USER_PER_PAGE || userIdx >= (pageIdx + 1) * ADMIN_USER_PER_PAGE) {
              return null
            }

            return (
              <tr key={userIdx}>
                <td>{user.userId}</td>
                <td>{user.userName}</td>
                <td>{user.userMail}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
