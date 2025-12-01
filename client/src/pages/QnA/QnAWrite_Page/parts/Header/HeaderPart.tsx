import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

import './HeaderPart.scss'

type HeaderPartProps = DivCommonProps & {}

/**
 * HeaderPart
 * - QnAWritePage 의 상단 헤더 컴포넌트
 * - 타이틀을 별도의 컴포넌트로 빼려다보니 만들었다.
 * - 나중에 타이틀 말고 추가적인 컴포넌트가 필요할때 활용할 수 있도록 한다.
 */
export const HeaderPart: FC<HeaderPartProps> = ({...props}) => {
  return (
    <div className={`Header_Part `} {...props}>
      {/* 1. 타이틀 */}
      <p className="_title_page">질문글 작성</p>
    </div>
  )
}
