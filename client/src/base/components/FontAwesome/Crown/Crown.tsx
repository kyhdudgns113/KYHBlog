import type {FC} from 'react'

import type {ImageCommonProps} from '@prop'

type CrownProps = ImageCommonProps & {}
export const Crown: FC<CrownProps> = ({className, ...props}) => {
  return <i className={`fa-solid fa-crown ${className}`} {...props} />
}
