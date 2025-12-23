import {useState, useCallback, useEffect, useRef} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'node_modules/remark-breaks/lib'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {emojify} from 'node-emoji'

import {MarkDownComponent, Modal} from '@component'
import {useBlogSelector} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './ReadingContentPart.scss'

type ReadingContentPartProps = DivCommonProps

export const ReadingContentPart: FC<ReadingContentPartProps> = ({...props}) => {
  // fileUser 변경 시 리렌더링되지 않도록 file과 fileOId만 선택적으로 구독
  const fileOId = useBlogSelector(state => state.file.fileOId)
  const file = useBlogSelector(state => state.file.file)

  const [stringArr, setStringArr] = useState<string[]>([])
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null)

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

  const onDoubleClickBlock = useCallback((e: Event) => {
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
    if (fileOId && file?.content) {
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
          // 이모지 코드 변환 (:bug: -> 🐛)
          return emojify(str)
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
      block.addEventListener('dblclick', onDoubleClickBlock)
    })

    return () => {
      blocks.forEach(block => {
        block.removeEventListener('dblclick', onDoubleClickBlock)
      })
    }
  }, [fileOId, stringArr]) // eslint-disable-line react-hooks/exhaustive-deps

  const onClickImage = useCallback((src: string) => {
    setPreviewImageSrc(src)
  }, [])

  const onClosePreview = useCallback(() => {
    setPreviewImageSrc(null)
  }, [])

  return (
    <div className={`ReadingContent_Part`} {...props}>
      <div className={`MarkdownArea`} key={fileOId || 'keys'} ref={containerRef}>
        <ReactMarkdown
          components={MarkDownComponent(stringArr, onClickImage)}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          skipHtml={false} // ::
        >
          {/* 1. 마크다운 적용할 "문자열" */}
          {stringArr.join('\n')}
        </ReactMarkdown>
      </div>

      <div className={`_bottomLine`} />

      {previewImageSrc && (
        <Modal className={`ImagePreviewModal`} onClose={onClosePreview}>
          <img alt="미리보기" src={previewImageSrc} style={{maxHeight: '90vh', maxWidth: '90vw'}} />
        </Modal>
      )}
    </div>
  )
}
