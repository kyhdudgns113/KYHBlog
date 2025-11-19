import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './_style.scss'

type BlogPartProps = DivCommonProps & {}

export const BlogPart: FC<BlogPartProps> = ({...props}) => {
  return (
    <div className={`Blog_Part _part_common`} {...props}>
      블로그
    </div>
  )
}
