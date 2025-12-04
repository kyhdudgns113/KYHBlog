import {Icon} from '@component'
import {useQnAActions} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './QnARightButton.scss'

type QnARightButtonProps = DivCommonProps & {}

export const QnARightButton: FC<QnARightButtonProps> = ({...props}) => {
  const {incQnAPageTenIdx} = useQnAActions()

  return <Icon className={`QnARightButton`} iconName="arrow_right" onClick={incQnAPageTenIdx} {...props} />
}
