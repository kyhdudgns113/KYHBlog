import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import {useFileActions} from '@redux'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type ReadingPageProps = DivCommonProps & {}

export const ReadingPage: FC<ReadingPageProps> = ({className, ...props}) => {
  const {setFileOId, resetFileOId} = useFileActions()

  const location = useLocation()

  // 초기화: fileOId from url
  useEffect(() => {
    const fileOId = location.pathname.split('/main/reading/')[1]
    if (fileOId) {
      setFileOId(fileOId)
    } // ::
    else {
      resetFileOId()
    }

    return () => {
      resetFileOId()
    }
  }, [location, resetFileOId, setFileOId])

  return (
    <div className={`ReadingPage ${className || ''}`} {...props}>
      <h1>ReadingPage</h1>
    </div>
  )
}
