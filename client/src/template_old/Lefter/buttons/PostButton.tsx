import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {Icon} from '@component'

import type {FC} from 'react'
import type {SpanCommonProps} from '@prop'

import '../_styles/Btn_Post.scss'

type PostButtonProps = SpanCommonProps & {}

export const PostButton: FC<PostButtonProps> = ({className, style, ...props}) => {
  const navigate = useNavigate()

  const onClickIcon = useCallback(() => {
    navigate('/main/posting')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Icon
      className={`Post_Button _icon ${className || ''}`}
      iconName="add_notes"
      onClick={onClickIcon}
      style={style}
      {...props} // ::
    />
  )
}
