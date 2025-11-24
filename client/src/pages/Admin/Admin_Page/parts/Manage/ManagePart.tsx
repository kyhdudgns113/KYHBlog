import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './ManagePart.scss'

type ManagePartProps = DivCommonProps & {}

export const ManagePart: FC<ManagePartProps> = ({...props}) => {
  return (
    <div className={`Manage_Part`} {...props}>
      <p>Manage 컴포넌트</p>
    </div>
  )
}
