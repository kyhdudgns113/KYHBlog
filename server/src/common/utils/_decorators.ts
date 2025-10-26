export function SendSocketRoomMessage(event: string): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args)

        if (result && result.server && result.roomId && result.payload) {
          result.server.to(result.roomId).emit(event, result.payload)
        }
        return result
        // ::
      } catch (errObj) {
        // ::
        console.log(`\n[SendSocketRoomMessage] ${event} 에러 발생: ${errObj}`)
        Object.keys(errObj).forEach(key => {
          console.log(`   ${key}: ${errObj[key]}`)
        })
        // ::
        throw errObj
      }
    }

    return descriptor
  }
}

export function SendSocketClientMessage(event: string): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args)

        if (result && result.client && result.payload) {
          result.client.emit(event, result.payload)
        }
        return result
        // ::
      } catch (errObj) {
        // ::
        console.log(`\n[SendSocketClientMessage] ${event} 에러 발생: ${errObj}`)
        Object.keys(errObj).forEach(key => {
          console.log(`   ${key}: ${errObj[key]}`)
        })
        // ::
        throw errObj
      }
    }
    return descriptor
  }
}
