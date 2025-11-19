import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {useBlogSelector} from '@redux'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

type BlogPartProps = DivCommonProps & {}

export const BlogPart: FC<BlogPartProps> = ({...props}) => {
  const nowTab = useBlogSelector(state => state.template.nowTab)

  const navigate = useNavigate()

  const onClickTab = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    navigate('/main/blog')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`Blog_Part _part_common ${nowTab === 'blog' ? '_selected' : ''}`} onClick={onClickTab} {...props}>
      블로그
    </div>
  )
}
