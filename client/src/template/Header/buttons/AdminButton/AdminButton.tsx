import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

import './AdminButton.scss'

type AdminButtonProps = SpanCommonProps & {}

export const AdminButton: FC<AdminButtonProps> = ({...props}) => {
  const navigate = useNavigate()

  const onClickIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    navigate('/main/admin')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Icon iconName="settings" className={`Admin_Button`} id="Admin_Button" onClick={onClickIcon} {...props} />
}
