import {useCallback, useEffect} from 'react'

import {useFileCallbacksContext} from '@context'
import {useBlogSelector} from '@redux'

import {RecentFileRowRObject} from '../../objects'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './RecentPostsPart.scss'

type RecentPostsPartProps = DivCommonProps & {}

export const RecentPostsPart: FC<RecentPostsPartProps> = ({...props}) => {
  const recentFiles = useBlogSelector(state => state.file.recentFiles)

  const {loadRecentFiles} = useFileCallbacksContext()

  const onClickTitle = useCallback(() => {
    loadRecentFiles()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 최근 게시글 로딩
  useEffect(() => {
    loadRecentFiles()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`RecentPosts_Part`} {...props}>
      <p className="_title_part" onClick={onClickTitle}>
        최근 게시글
      </p>

      <div className="_post_list_part">
        {recentFiles.map(fileRow => (
          <RecentFileRowRObject key={fileRow.fileOId} fileRow={fileRow} />
        ))}
      </div>
    </div>
  )
}
