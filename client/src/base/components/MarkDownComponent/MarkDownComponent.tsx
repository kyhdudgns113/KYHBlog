import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

import type {RefObject} from 'react'
import type {Components} from 'react-markdown'

/* eslint-disable */
export const MarkDownComponent = (
  stringArr: string[],
  onImageClick?: (src: string) => void
): Components => {
  const ret: Components = {
    a({...props}) {
      return <a {...props} target="_blank" rel="noopener noreferrer" />
    },

    img({src, alt, ...props}) {
      return (
        <img
          {...props}
          alt={alt}
          onClick={() => {
            if (src && onImageClick) {
              onImageClick(src)
            }
          }}
          src={src}
          style={{cursor: 'pointer', maxWidth: '100%', height: 'auto'}}
        />
      )
    },

    code({node, className, children, ref, style, ...props}) {
      const inline = node?.position === undefined
      const match = /language-(\w+)/.exec(className || '')
      const _ref = ref as RefObject<SyntaxHighlighter> | null // eslint 때문에 이렇게 해줌

      if (!inline && match) {
        return (
          <SyntaxHighlighter
            customStyle={{...style, borderColor: '#BBBBBB', borderWidth: '2px', borderRadius: '0.5rem', padding: '1em'}}
            language={match[1]}
            PreTag="div"
            ref={_ref}
            {...props} // ::
          >
            {String(children)}
          </SyntaxHighlighter>
        )
      } // ::
      else {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        )
      }
    },

    li({children, node, ...props}) {
      const line = node?.position?.start?.line
      const raw = line ? stringArr[line - 1] : ''
      const trimmed = raw?.trimStart() || ''

      let headerRemoved = ''

      let marker = '•'
      let fontSize = '16px'
      let isOrdered = false
      let lineHeight = ''
      let markerSize: string | number = 16
      let paddingTop: string | number = 0
      let paddingBottom: string | number = 0

      const marginRight = '8px'
      const alignItems = 'center'

      // 리스트 앞에 붙은 기호에 따라 폰트 크기와 마진 탑을 조정한다.
      if (trimmed.startsWith('+')) {
        markerSize = 8
        marker = '■'
        paddingTop = 6
        headerRemoved = trimmed.replace(/^\+ /, '')
      } // ::
      else if (trimmed.startsWith('*')) {
        markerSize = 8
        marker = '◯'
        paddingTop = 8

        headerRemoved = trimmed.replace(/^\* /, '')
      } // ::
      else if (trimmed.startsWith('-')) {
        marker = '•'
        paddingTop = 6
        headerRemoved = trimmed.replace(/^\- /, '')
      } // ::
      else if (/^\d+\./.test(trimmed)) {
        // ol 의 자식으로 렌더링되는 경우이다.
        isOrdered = true
        headerRemoved = trimmed.replace(/^\d+\. /, '')
      } // ::

      // 리스트 뒤에 붙은 h 숫자에 따라 폰트 크기와 마진 탑을 조정한다.
      if (headerRemoved.startsWith('######')) {
        fontSize = '14px'
        lineHeight = '28px'
        paddingTop += -7
        markerSize *= 0.7

        if (trimmed.startsWith('*')) {
          paddingTop -= 1
        }
      } // ::
      else if (headerRemoved.startsWith('#####')) {
        fontSize = '16px'
        lineHeight = '32px'
        paddingTop += -8
        markerSize *= 0.9

        if (trimmed.startsWith('+')) {
          paddingTop += 1
        }
      } // ::
      else if (headerRemoved.startsWith('####')) {
        fontSize = '18px'
        lineHeight = '32px'
        paddingTop += -8

        if (trimmed.startsWith('+')) {
          paddingTop += 1
        }
      } // ::
      else if (headerRemoved.startsWith('###')) {
        fontSize = '22px'
        lineHeight = '32px'
        paddingTop += -7
        markerSize *= 1.2

        if (trimmed.startsWith('*')) {
          paddingTop += -1
        }
      } // ::
      else if (headerRemoved.startsWith('##')) {
        fontSize = '26px'
        lineHeight = '40px'
        paddingTop += -8
        markerSize *= 1.5
      } // ::
      else if (headerRemoved.startsWith('#')) {
        fontSize = '32px'
        lineHeight = '48px'
        paddingTop += -8
        markerSize *= 2
      } // ::
      else {
        /**
         * ### 가 아닌 그냥 텍스트가 들어오는 경우
         * - fontSize 는 그대로 16px 이다.
         */
        fontSize = '16px'
        lineHeight = '24px'
        paddingTop += -16
      }

      // marginTop 을 string 화 한다.
      paddingTop = paddingTop.toString() + 'px'
      paddingBottom = paddingBottom.toString() + 'px'
      markerSize = markerSize.toString() + 'px'

      if (isOrdered) {
        /**
         * ol 의 자식인 경우다.
         * -
         */
        return (
          <li {...props} style={{fontSize, lineHeight, marginLeft: '1rem'}}>
            {children}
          </li>
        )
      } // ::

      return (
        <li
          {...props}
          style={{
            alignItems: 'flex-start',
            display: 'flex',
            height: 'fit-content',
            fontSize
          }}
        >
          {marker && (
            <span
              style={{alignItems, fontSize: markerSize, lineHeight, marginRight, paddingBottom, paddingTop, textAlign: 'center', userSelect: 'none'}}
            >
              {marker}
            </span>
          )}
          <div>{children}</div>
        </li>
      )
    },

    ol({children, ...props}) {
      return (
        <ol
          {...props}
          style={{
            listStyleType: 'decimal',
            paddingLeft: '0.5rem'
          }}
        >
          {children}
        </ol>
      )
    },

    ul({children, ...props}) {
      return (
        <ul
          {...props}
          style={{
            listStyleType: 'none',
            paddingLeft: '0.5rem'
          }}
        >
          {children}
        </ul>
      )
    }
  }
  return ret
}
