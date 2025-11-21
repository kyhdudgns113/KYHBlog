import {useCallback, useEffect, useEffectEvent, useState} from 'react'
import {useBlogSelector} from '@redux'

import {BlogLefterPart} from './parts'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as T from '@type'

import './Lefter.scss'

type LefterProps = DivCommonProps & {}

export const Lefter: FC<LefterProps> = ({...props}) => {
  const nowTab = useBlogSelector(state => state.template.nowTab)

  const [cnBlog, setCnBlog] = useState<string>('_close')
  const [isOpenBlog, setIsOpenBlog] = useState<boolean>(false)

  const closePart = useCallback(() => {
    setCnBlog('_close')
    new Promise(resolve => {
      setTimeout(() => {
        setIsOpenBlog(false)
        resolve(true)
      }, 400)
    })
  }, [])

  const openPart = useCallback((which: T.NowTabType) => {
    const isBlog = which === 'blog'

    !isBlog && setCnBlog('_close')

    new Promise(resolve => {
      setTimeout(() => {
        setIsOpenBlog(isBlog)
        resolve(true)
      }, 400)
    }).then(() => {
      setTimeout(() => {
        isBlog && setCnBlog('_open')
      }, 10)
    })
  }, [])

  const lefterChangeEvent = useEffectEvent(async (nowTab: T.NowTabType) => {
    if (nowTab) {
      openPart(nowTab)
    } // ::
    else {
      closePart()
    }
  })

  useEffect(() => {
    lefterChangeEvent(nowTab)
  }, [nowTab])

  return (
    <div className={`Lefter`} {...props}>
      {isOpenBlog && <BlogLefterPart className={cnBlog} closePart={closePart} />}
    </div>
  )
}
