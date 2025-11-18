import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import '../_styles/Part_TitleArea.scss'

type TitleAreaPartProps = DivCommonProps & {}

export const TitleAreaPart: FC<TitleAreaPartProps> = ({className, ...props}) => {
  const navigate = useNavigate()

  const onClickTitle = useCallback(() => {
    navigate('/')
  }, [navigate]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`TitleArea_Part ${className || ''}`} {...props}>
      <p className="_title_part" onClick={onClickTitle}>
        강영훈의 블로그
      </p>
    </div>
  )
}
