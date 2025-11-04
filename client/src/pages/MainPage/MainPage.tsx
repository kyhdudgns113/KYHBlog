import {useCallback, useEffect, useRef, useState} from 'react'
import {useBlogSelector} from '@redux'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import {MarkDownComponent} from '@component'
import {CheckAuth} from '@guard'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import * as SV from '@shareValue'

import './MainPage.scss'

type MainPageProps = DivCommonProps & {
  reqAuth?: number
}

export const MainPage: FC<MainPageProps> = ({reqAuth, className, ...props}) => {
  const file = useBlogSelector(state => state.file.file)
  const fileOId = useBlogSelector(state => state.file.fileOId)

  const [stringArr, setStringArr] = useState<string[]>([])

  const containerRef = useRef<HTMLDivElement>(null)

  const onClickStatus = useCallback((e: Event) => {
    e.stopPropagation()
    e.preventDefault()

    const target = e.currentTarget as HTMLElement
    const parent = target.parentElement

    if (!parent) return

    const childrens = parent.children

    Array.from(childrens).forEach(children => {
      const child = children as HTMLElement
      child.hidden = false
    })

    target.hidden = true
  }, [])

  const onDoubleClick = useCallback((e: Event) => {
    e.stopPropagation()
    e.preventDefault()

    const target = e.currentTarget as HTMLElement
    const childrens = target.children

    let isHidden = false
    let isStatusExist = false

    Array.from(childrens).forEach((children, idx) => {
      if (idx > 0) {
        const child = children as HTMLElement

        child.hidden = !child.hidden
        if (!child.className.includes('_blockStatus')) {
          isHidden = child.hidden
        } // ::
        else {
          isStatusExist = true
        }
      }
    })

    if (isHidden && !isStatusExist) {
      const span = document.createElement('span')
      span.className = '_blockStatus material-symbols-outlined align-middle select-none '
      span.textContent = 'more_horiz'
      span.addEventListener('click', onClickStatus)
      target.appendChild(span)
    }

    // 이거 해줘야 펼쳐진 상태로 될 때 selection 이 안된다.
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: stringArr
  useEffect(() => {
    if (fileOId) {
      setStringArr(
        file.content.split('\n').map(str => {
          if (!str) {
            return ''
          } // ::
          else if (str === '  ') {
            // return '  ' // 아무일도 일어나지 않음
            // return '' // 아무일도 일어나지 않음
            // return '&nbsp;' // 3줄 띄어짐
            // return '<span />' // 3줄 띄어짐
            // return '<p />' // 이후 리스트 이상하게 적용됨
            // return '   ' // 아무일도 안 일어남
            // return '\n' // 아무일도 안 일어남
            // return '\n\n' // 마크다운 밀림
            // return '  \n' // 아무일도 일어나지 않음?
            // return '  <br />' // 4칸 띄어짐
            // return '<br />' // 4칸 띄어짐
            // return ' ' // 아무일 X
            // return '<></>' // 이런것들 싹 다 그대로 출력됨.
            // return '<div />' // 마크다운 에러남
            // return '<b></b>' // 3줄 띄어짐
            return '  ' // 그냥 이거 쓰지 말자
          } // ::
          else if (str === '<br />') {
            return '  <br />'
          }
          return str
        })
      )
    }
  }, [file, fileOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 이벤트 리스너: div.block_ 에 더블클릭 이벤트 부착
  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const blocks = container.querySelectorAll('[class*="block_"]')
    blocks.forEach(block => {
      block.addEventListener('dblclick', onDoubleClick)
    })

    return () => {
      blocks.forEach(block => {
        block.removeEventListener('dblclick', onDoubleClick)
      })
    }
  }, [fileOId, stringArr]) // eslint-disable-line react-hooks/exhaustive-deps

  /* eslint-disable */
  return (
    <CheckAuth reqAuth={reqAuth || SV.AUTH_GUEST}>
      <div className={`MainPage ${className || ''}`} {...props}>
        <div className="_pageWrapper">
          <div className="MarkdownArea" key={fileOId || 'keys'} ref={containerRef}>
            <ReactMarkdown
              components={MarkDownComponent(stringArr)}
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm, remarkBreaks]}
              skipHtml={false} // ::
            >
              {/* 1. 마크다운 적용할 "문자열" */}
              {stringArr.join('\n')}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </CheckAuth>
  )
}
