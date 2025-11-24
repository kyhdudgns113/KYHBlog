import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'

import type {FC, MouseEvent} from 'react'
import type {SpanCommonProps} from '@prop'

import './PostingButton.scss'

type PostingButtonProps = SpanCommonProps & {}

export const PostingButton: FC<PostingButtonProps> = ({...props}) => {
  const navigate = useNavigate()

  const onClickIcon = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    e.stopPropagation()
    navigate('/main/admin/posting')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Icon iconName="add_notes" className={`Posting_Button`} onClick={onClickIcon} {...props} />
}
