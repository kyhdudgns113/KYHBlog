import type {FC} from 'react'
import type {ImageCommonProps} from '@prop'

type InfoProps = ImageCommonProps & {}

export const Info: FC<InfoProps> = ({className, ...props}) => {
  return <i className={`fa-solid fa-info ${className}`} {...props} />
}
