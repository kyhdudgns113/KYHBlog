import {DEBUG_MODE} from '@secret'

export const alertErrMsg = (where: string, statusCode: number, gkdErrMsg: string, message: string) => {
  const isDebug = true

  let alertString = isDebug ? `${where} ` : ''

  if (gkdErrMsg) {
    alertString += `\nstatus: ${statusCode}\ngkdErrMsg: ${gkdErrMsg}`
  } // ::
  else if (message) {
    alertString += `\nstatus: ${statusCode}\n${message}`
  } // ::
  else {
    alertString += `\nstatus: ${statusCode}\n알 수 없는 에러`
  }

  alert(alertString)
}
export const alertErrors = (where: string, errObj: any) => {
  if (errObj.expiredAt) {
    alert(`토큰이 만료되었어요. 새로고침 이후 다시 로그인 해주세요.`)
  } // ::
  else if (errObj.statusCode) {
    alert(`${where} 에러 발생. status: ${errObj.statusCode}`)
  } // ::
  else {
    if (DEBUG_MODE) {
      console.log(`${where} 알 수 없는 에러 발생.`)
      console.log(errObj)
      Object.keys(errObj).forEach(key => {
        console.log(`  ${key}: ${errObj[key]}`)
      })
    } // ::
    alert(`${where} 알 수 없는 에러 발생했어요.`)
  }
}
