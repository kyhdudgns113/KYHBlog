import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './RecentPostsPart.scss'

type RecentPostsPartProps = DivCommonProps & {}

export const RecentPostsPart: FC<RecentPostsPartProps> = ({...props}) => {
  return (
    <div className={`RecentPosts_Part`} {...props}>
      <p className="_title_part">최근 게시글</p>

      <div className="_post_list_part">
        <p>2123</p>
      </div>
    </div>
  )
}
