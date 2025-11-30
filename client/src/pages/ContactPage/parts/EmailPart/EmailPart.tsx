import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import {Icon} from '@component'

import './EmailPart.scss'

type EmailPartProps = DivCommonProps & {}

export const EmailPart: FC<EmailPartProps> = ({...props}) => {
  const email = 'dudgns113@gmail.com'
  const onClickEmail = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      try {
        // 최신 Clipboard API 사용
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email)
          alert('이메일이 복사되었습니다!')
        } // ::
        else {
          // Fallback: 예전 방식 사용
          const textArea = document.createElement('textarea')
          textArea.value = email
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()

          const successful = document.execCommand('copy')
          document.body.removeChild(textArea)

          if (successful) {
            alert('이메일이 복사되었습니다!')
          } // ::
          else {
            throw new Error('복사 명령 실행 실패')
          }
        }
        // ::
      } catch (error) {
        // ::
        alert('복사에 실패했습니다. 수동으로 복사해주세요: ' + email)
      }
    },
    [email]
  )

  return (
    <div className={`Email_Part`} {...props}>
      <div className="_contact_item" onClick={onClickEmail}>
        <div className="_icon_wrapper">
          <Icon iconName="email" className="_icon" />
        </div>
        <div className="_contact_info">
          <span className="_contact_label">이메일</span>
          <span className="_contact_value">{email}</span>
        </div>
        <Icon iconName="content_copy" className="_copy_icon" />
      </div>
    </div>
  )
}

