import {DEBUG_MODE} from '@secret'

export * from './_decorators'
export * from './_extraObjects'

export const consoleColors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m'
}

export const generateObjectId = (): string => {
  // MongoDB ObjectId 비슷하게 24자리 hex string 생성
  return Array.from({length: 24}, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

export const getEndValue = () => {
  const now = new Date() // 현재 시간 가져오기
  const seoulTime = new Date(now.toLocaleString('en-US', {timeZone: 'Asia/Seoul'})) // 서울 시간으로 변환
  const dayOfWeek = seoulTime.getDay() // 서울 시간 기준으로 요일을 가져옴 (0: 일요일, 1: 월요일, ... 6: 토요일)

  const offsetDays = 6 - dayOfWeek

  // 서울 시간에서 가장 가까운 월요일로 날짜 이동
  seoulTime.setDate(seoulTime.getDate() + offsetDays)

  const year = seoulTime.getFullYear() % 100 // 연도의 마지막 두 자리만 가져옴
  const month = seoulTime.getMonth() + 1 // 월은 0부터 시작하므로 1을 더함
  const day = seoulTime.getDate() // 일

  // 연, 월, 일을 두 자릿수로 변환한 후 합침
  return Number(`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`)
}
export const getFailResponse = (errObj: any) => {
  const gkdErrMsg = errObj.gkdErrMsg || `서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`
  const statusCode = errObj.statusCode || 500

  /**
   * jwtFromServer 를 빈 문자열로 처리해도 된다.
   * - 빈 문자열이면 안되는 경우는 controller 에서 이 값을 안 쓴다.
   */
  const jwtFromServer = ''

  if (DEBUG_MODE) {
    console.log(`\ngkdErrMsg: ${gkdErrMsg}`)
    console.log(`errObj: ${errObj}`)

    Object.keys(errObj).forEach(key => {
      console.log(`   ${key}: ${errObj[key]}`)
    })
  }
  return {ok: false, body: {}, gkdErrMsg, statusCode, jwtFromServer}
}
export const getStartValue = () => {
  const now = new Date() // 현재 시간 가져오기
  const seoulTime = new Date(now.toLocaleString('en-US', {timeZone: 'Asia/Seoul'})) // 서울 시간으로 변환
  const dayOfWeek = seoulTime.getDay() // 서울 시간 기준으로 요일을 가져옴 (0: 일요일, 1: 월요일, ... 6: 토요일)

  let offsetDays: number

  // 월요일이면 당일, 일요일이면 다음날 월요일, 그 외에는 직전 월요일 계산
  if (dayOfWeek === 0) {
    // 일요일이면 다음 날 월요일
    offsetDays = -1
  } else {
    offsetDays = dayOfWeek - 1
  }

  // 서울 시간에서 가장 가까운 월요일로 날짜 이동
  seoulTime.setDate(seoulTime.getDate() - offsetDays)

  const year = seoulTime.getFullYear() % 100
  const month = seoulTime.getMonth() + 1
  const day = seoulTime.getDate()

  return Number(`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`)
}
export const getTodayValue = () => {
  const now = new Date() // 현재 시간 가져오기
  const seoulTime = new Date(now.toLocaleString('en-US', {timeZone: 'Asia/Seoul'})) // 서울 시간으로 변환

  const year = seoulTime.getFullYear() % 100
  const month = seoulTime.getMonth() + 1
  const day = seoulTime.getDate()

  // 연, 월, 일을 두 자릿수로 변환한 후 합침
  return Number(`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`)
}

export const printErrObj = (errObj: any) => {
  console.log(`\nerrObj: ${errObj}`)

  Object.keys(errObj).forEach(key => {
    console.log(`   ${key}: ${errObj[key]}`)
  })
}

export const shiftDateValue = (startOrEnd: number, shift: number) => {
  const dateStr = startOrEnd.toString()
  const year = parseInt('20' + dateStr.slice(0, 2))
  const month = parseInt(dateStr.slice(2, 4)) - 1
  const day = parseInt(dateStr.slice(4, 6))

  const date = new Date(year, month, day)

  date.setDate(date.getDate() + shift)

  const newYear = date.getFullYear().toString().slice(2)
  const newMonth = (date.getMonth() + 1).toString().padStart(2, '0')
  const newDay = date.getDate().toString().padStart(2, '0')

  return parseInt(`${newYear}${newMonth}${newDay}`)
}
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
