import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import type {FC, MouseEvent} from 'react'
import type {LT} from '@localizeType'

import './QnARowObject.scss'

type QnARowObjectProps = {
  qnARow: LT.QnARowTypeLocal
}

export const QnARowObject: FC<QnARowObjectProps> = ({qnARow}) => {
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
    (qnAOId: string) => (e: MouseEvent<HTMLTableRowElement>) => {
      e.stopPropagation()
      navigate(`/main/qna/read/${qnAOId}`)
    },
    [navigate]
  )

  return (
    <tr className={`QnARow_Object`} onClick={onClickRow(qnARow.qnAOId)}>
      <td className={`_td_createdAt`}>{formatDate(qnARow.createdAtValue)}</td>
      <td className={`_td_title`}>
        {qnARow.isPrivate && <span className={`_private_badge`}>비공개</span>}
        {qnARow.title}
      </td>
      <td className={`_td_author`}>{qnARow.userName}</td>
    </tr>
  )
}

