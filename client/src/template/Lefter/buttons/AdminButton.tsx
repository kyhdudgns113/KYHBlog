import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {Icon} from '@component'

import type {FC} from 'react'
import type {SpanCommonProps} from '@prop'

import '../_styles/Btn_Admin.scss'

type AdminButtonProps = SpanCommonProps & {}

export const AdminButton: FC<AdminButtonProps> = ({className, style, ...props}) => {
  const navigate = useNavigate()

  const onClickIcon = useCallback(() => {
    navigate('/main/admin')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Icon
      className={`Admin_Button _icon ${className || ''}`}
      iconName="settings"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
