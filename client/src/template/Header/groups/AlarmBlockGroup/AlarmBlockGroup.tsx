import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useUserCallbacksContext} from '@context'
import {useAlarmActions} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import * as LT from '@localizeType'
import * as SV from '@shareValue'

import './AlarmBlockGroup.scss'

type AlarmBlockGroupProps = DivCommonProps & {
  alarm: LT.AlarmTypeLocal
}

export const AlarmBlockGroup: FC<AlarmBlockGroupProps> = ({alarm, className, ...props}) => {
  const navigate = useNavigate()
  const {closeAlarmObj} = useAlarmActions()
  const {removeAlarm} = useUserCallbacksContext()

  const formatDate = (createdAtValue: number): string => {
    const date = new Date(createdAtValue)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR')
  }

  const getAlarmTypeText = (alarmType: number): string => {
    if (alarmType === SV.ALARM_TYPE_FILE_COMMENT) return '파일 댓글'
    if (alarmType === SV.ALARM_TYPE_COMMENT_REPLY) return '댓글 답글'
    if (alarmType === SV.ALARM_TYPE_TAG_REPLY) return '태그 답글'
    return '알림'
  }

  const onClickAlarmBlockGroup = useCallback(
    (alarm: LT.AlarmTypeLocal) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()

      navigate(`/main/blog/${alarm.fileOId}`)
      removeAlarm(alarm.alarmOId)
      closeAlarmObj()
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div
      className={`AlarmBlock_Group ${alarm.alarmStatus === SV.ALARM_STATUS_NEW ? '_item_new' : '_item_old'} ${className || ''}`}
      onClick={onClickAlarmBlockGroup(alarm)}
      {...props} // ::
    >
      <div className={`_item_content_group`}>
        <div className={`_item_type_group`}>{getAlarmTypeText(alarm.alarmType)}</div>
        <div className={`_item_text_group`}>{alarm.content}</div>
        <div className={`_item_sender_group`}>from: {alarm.senderUserName}</div>
      </div>
      <div className={`_item_time_group`}>{formatDate(alarm.createdAtValue)}</div>
    </div>
  )
}
