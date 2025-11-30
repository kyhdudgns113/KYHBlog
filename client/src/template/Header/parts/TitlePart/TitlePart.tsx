import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import './TitlePart.scss'

type TitlePartProps = DivCommonProps & {}

export const TitlePart: FC<TitlePartProps> = ({...props}) => {
  const navigate = useNavigate()

  const onClickTitle = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    navigate('/')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`Title_Part`} onClick={onClickTitle} {...props}>
      강영훈의 블로그
    </div>
  )
}
