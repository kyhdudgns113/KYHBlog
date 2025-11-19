import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

type HomePartProps = DivCommonProps & {}

export const HomePart: FC<HomePartProps> = ({...props}) => {
  const nowTab = useBlogSelector(state => state.template.nowTab)

  const navigate = useNavigate()

  const onClickTab = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    navigate('/main/home')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`Home_Part _part_common ${nowTab === 'home' ? '_selected' : ''}`} onClick={onClickTab} {...props}>
      홈
    </div>
  )
}
