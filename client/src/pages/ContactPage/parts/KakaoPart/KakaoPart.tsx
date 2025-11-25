import {useCallback} from 'react'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

import {Icon} from '@component'

import './KakaoPart.scss'

type KakaoPartProps = DivCommonProps & {}

export const KakaoPart: FC<KakaoPartProps> = ({...props}) => {
  const kakaoId = 'kyhdudgns113'
  const onClickKakao = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      try {
        // 최신 Clipboard API 사용
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(kakaoId)
          alert('카카오톡 ID가 복사되었습니다!')
        } // ::
        else {
          // Fallback: 예전 방식 사용
          const textArea = document.createElement('textarea')
          textArea.value = kakaoId
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()

          const successful = document.execCommand('copy')
          document.body.removeChild(textArea)

          if (successful) {
            alert('카카오톡 ID가 복사되었습니다!')
          } // ::
          else {
            throw new Error('복사 명령 실행 실패')
          }
        }
        // ::
      } catch (error) {
        // ::
        alert('복사에 실패했습니다. 수동으로 복사해주세요: ' + kakaoId)
      }
    },
    [kakaoId]
  )

  return (
    <div className={`Kakao_Part`} {...props}>
      <div className="_contact_item" onClick={onClickKakao}>
        <div className="_icon_wrapper">
          <Icon iconName="chat" className="_icon" />
        </div>
        <div className="_contact_info">
          <span className="_contact_label">카카오톡 ID</span>
          <span className="_contact_value">{kakaoId}</span>
        </div>
        <Icon iconName="content_copy" className="_copy_icon" />
      </div>
    </div>
  )
}

