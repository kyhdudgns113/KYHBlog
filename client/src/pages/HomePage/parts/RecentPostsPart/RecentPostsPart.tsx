import {useBlogSelector} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './RecentPostsPart.scss'

type RecentPostsPartProps = DivCommonProps & {}

export const RecentPostsPart: FC<RecentPostsPartProps> = ({...props}) => {
  const recentFiles = useBlogSelector(state => state.file.recentFiles)

  return (
    <div className={`RecentPosts_Part`} {...props}>
      <p className="_title_part">최근 게시글: {recentFiles.length}개</p>

      <div className="_post_list_part">
        {recentFiles.map(file => (
          <div key={file.fileOId}>
            <p>{file.fileName}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
