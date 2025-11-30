import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

import './UsersButton.scss'

type UsersButtonProps = SpanCommonProps & {}

export const UsersButton: FC<UsersButtonProps> = ({...props}) => {
  const navigate = useNavigate()

  const onClickIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    e.stopPropagation()
    navigate('/main/admin/users')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Icon iconName="group_search" className={`Users_Button`} onClick={onClickIcon} {...props} />
}

