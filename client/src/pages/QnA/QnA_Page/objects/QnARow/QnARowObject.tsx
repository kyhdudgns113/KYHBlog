import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAuthStatesContext} from '@context'
import {useTemplateActions} from '@redux'

import type {FC, MouseEvent} from 'react'

import * as LT from '@localizeType'

import './QnARowObject.scss'

type QnARowObjectProps = {
  qnARow: LT.QnARowTypeLocal
}

export const QnARowObject: FC<QnARowObjectProps> = ({qnARow}) => {
  const {userOId} = useAuthStatesContext()

  const {clickLogInBtn} = useTemplateActions()

  const navigate = useNavigate()

  const formatDate = useCallback((createdAtValue: number): string => {
    const date = new Date(createdAtValue)
    const year = date.getFullYear() % 100
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayOfWeek = date.getDay()

    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const dayName = dayNames[dayOfWeek]

    return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')} ${dayName}`
  }, [])

  const onClickRow = useCallback(
    (userOId: string, qnAOId: string) => (e: MouseEvent<HTMLTableRowElement>) => {
      e.stopPropagation()

      if (!userOId) {
        alert('로그인 후 이용해주세요.')
        clickLogInBtn()
        return
      } // ::
      else {
        navigate(`/main/qna/read/${qnAOId}`)
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <tr className={`QnARow_Object`} onClick={onClickRow(userOId, qnARow.qnAOId)}>
      <td className={`_td_createdAt`}>{formatDate(qnARow.createdAtValue)}</td>
      <td className={`_td_title`}>
        {qnARow.isPrivate && <span className={`_private_badge`}>비공개</span>}
        {qnARow.title}
      </td>
      <td className={`_td_author`}>{qnARow.userName}</td>
    </tr>
  )
}
