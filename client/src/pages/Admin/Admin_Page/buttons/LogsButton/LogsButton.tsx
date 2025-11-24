import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

import './LogsButton.scss'

type LogsButtonProps = SpanCommonProps & {}

export const LogsButton: FC<LogsButtonProps> = ({...props}) => {
  const navigate = useNavigate()

  const onClickIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    e.stopPropagation()
    navigate('/main/admin/logs')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Icon iconName="dvr" className={`Logs_Button`} onClick={onClickIcon} {...props} />
}
