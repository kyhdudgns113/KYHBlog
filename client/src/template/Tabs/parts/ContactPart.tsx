import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

type ContactPartProps = DivCommonProps & {}

export const ContactPart: FC<ContactPartProps> = ({...props}) => {
  const nowTab = useBlogSelector(state => state.template.nowTab)

  const navigate = useNavigate()

  const onClickTab = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    navigate('/main/contact')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`Contact_Part _part_common ${nowTab === 'contact' ? '_selected' : ''}`} onClick={onClickTab} {...props}>
      Contact
    </div>
  )
}
