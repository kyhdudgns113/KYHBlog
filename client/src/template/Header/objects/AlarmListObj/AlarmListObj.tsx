import {useBlogSelector} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as LT from '@localizeType'
import * as SV from '@shareValue'

import './AlarmListObj.scss'

type AlarmListObjProps = DivCommonProps & {}

export const AlarmListObj: FC<AlarmListObjProps> = ({...props}) => {
  const alarmArr = useBlogSelector(state => state.alarm.alarmArr)

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

  return (
    <div className={`AlarmList_Object`} onClick={e => e.stopPropagation()} {...props}>
      {/* 1. 헤더 */}
      <div className={`_header`}>
        <div className={`_header_title`}>알림</div>
        {alarmArr.length > 0 && <div className={`_header_count`}>{alarmArr.filter(alarm => alarm.alarmStatus === SV.ALARM_STATUS_NEW).length}</div>}
      </div>

      {/* 2. 알림 목록 */}
      <div className={`_list`}>
        {alarmArr.length === 0 ? (
          <div className={`_empty`}>알림이 없습니다.</div>
        ) : (
          alarmArr.map((alarm: LT.AlarmTypeLocal) => (
            <div key={alarm.alarmOId} className={`_item ${alarm.alarmStatus === SV.ALARM_STATUS_NEW ? '_item_new' : '_item_old'}`}>
              <div className={`_item_content`}>
                <div className={`_item_type`}>{getAlarmTypeText(alarm.alarmType)}</div>
                <div className={`_item_text`}>{alarm.content}</div>
                <div className={`_item_sender`}>from: {alarm.senderUserName}</div>
              </div>
              <div className={`_item_time`}>{formatDate(alarm.createdAtValue)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
