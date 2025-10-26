import type {FC} from 'react'
import type {ImageCommonProps} from '@prop'

type CircleInfoProps = ImageCommonProps & {}

export const CircleInfo: FC<CircleInfoProps> = ({className, ...props}) => {
  return <i className={`fa-solid fa-circle-info ${className}`} {...props} />
}
