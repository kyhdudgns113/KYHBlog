import {useCallback, useEffect, useEffectEvent, useState} from 'react'
import {useLocation} from 'react-router-dom'

import {useBlogSelector} from '@redux'

import {AdminPostingLefterPart, BlogLefterPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as T from '@type'

import './Lefter.scss'

type LefterProps = DivCommonProps & {}

const DELAY_IS_OPEN = 400
const DELAY_CN_CHANGE = 10

export const Lefter: FC<LefterProps> = ({...props}) => {
  const nowTab = useBlogSelector(state => state.template.nowTab)

  const [cnBlog, setCnBlog] = useState<string>('_close')
  const [cnAdminPosting, setCnAdminPosting] = useState<string>('_close')
  const [isOpenBlog, setIsOpenBlog] = useState<boolean>(false)
  const [isOpenAdminPosting, setIsOpenAdminPosting] = useState<boolean>(false)

  const location = useLocation()

  const closePart = useCallback(() => {
    setCnBlog('_close')
    setCnAdminPosting('_close')
    new Promise(resolve => {
      setTimeout(() => {
        setIsOpenBlog(false)
        setIsOpenAdminPosting(false)
        resolve(true)
      }, DELAY_IS_OPEN)
    })
  }, [])

  const openPart = useCallback((which: T.NowTabType, isAdminPosting: boolean) => {
    const isBlog = which === 'blog'

    !isBlog && setCnBlog('_close')
    !isAdminPosting && setCnAdminPosting('_close')

    new Promise(resolve => {
      setTimeout(() => {
        setIsOpenBlog(isBlog)
        setIsOpenAdminPosting(isAdminPosting)
        resolve(true)
      }, DELAY_IS_OPEN)
    }) // ::
      .then(() => {
        setTimeout(() => {
          isBlog && setCnBlog('_open')
          isAdminPosting && setCnAdminPosting('_open')
        }, DELAY_CN_CHANGE)
      })
  }, [])

  const lefterChangeEvent = useEffectEvent(async (nowTab: T.NowTabType, location: ReturnType<typeof useLocation>) => {
    const isAdminPosting = location.pathname.includes('/admin/posting')
    if (nowTab || isAdminPosting) {
      openPart(nowTab, isAdminPosting)
    } // ::
    else {
      closePart()
    }
  })

  // 탭 변경시 레프터 열기/닫기
  useEffect(() => {
    lefterChangeEvent(nowTab, location)
  }, [location, nowTab])

  return (
    <div className={`Lefter`} {...props}>
      {/* 블로그 레프터 */}
      {isOpenBlog && <BlogLefterPart className={cnBlog} closePart={closePart} />}

      {/* 관리자(포스팅) 레프터 */}
      {isOpenAdminPosting && <AdminPostingLefterPart className={cnAdminPosting} closePart={closePart} />}
    </div>
  )
}
