import type {FC} from 'react'
import type {ImageCommonProps} from '@prop'

type PersonProps = ImageCommonProps & {}

export const Person: FC<PersonProps> = ({className, ...props}) => {
  return <i className={`fa-solid fa-person ${className}`} {...props} />
}
