import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './BlogPage.scss'

type BlogPageProps = DivCommonProps & {}

export const BlogPage: FC<BlogPageProps> = ({...props}) => {
  return (
    <div className={`BlogPage`} {...props}>
      <p>블로그 페이지</p>
    </div>
  )
}

