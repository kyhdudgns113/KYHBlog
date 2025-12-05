import {Icon} from '@component'
import {useQnAActions} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnALeftButton.scss'

type QnALeftButtonProps = DivCommonProps & {}

export const QnALeftButton: FC<QnALeftButtonProps> = ({...props}) => {
  const {decQnAPageTenIdx} = useQnAActions()

  return <Icon className={`QnALeftButton`} iconName="arrow_left" onClick={decQnAPageTenIdx} {...props} />
}
