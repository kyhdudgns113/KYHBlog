import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './PostsPart.scss'

type PostsPartProps = DivCommonProps & {}

export const PostsPart: FC<PostsPartProps> = ({className, style, ...props}) => {
  return (
    <div className={`PostsPart _admin_part ${className || ''}`} style={style} {...props}>
      <p className="_part_title">Posts</p>
    </div>
  )
}
