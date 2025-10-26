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
