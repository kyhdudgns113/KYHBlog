# 서버와 http 통신을 하는 함수들을 모았다.

정말 **가급적** postWithJwt 같은 함수를 쓰자.

- 여기에 GKDoubleJWT 를 적용했다.

### 사용예시:

```javascript
postWithJwt('요청 URL', data: HTTPDataTypeDefinedByUser)
  .then(res => res.json())
  .then(res => {
    DO SOMETHING
  })
  .catch(errObj => {
    DO SOMETHING
  })
```

### 권장 사용 예시:

```javascript
postWithJwt('요청 URL', data: HTTPDataTypeDefinedByUser)
  .then(res => res.json())
  .then(res => {
    const {ok, body, errObj, jwtFromServer} = res
    if (ok) {
      DO SOMETHING
      writeJwtFromServer(jwtFromServer)
    }
    else {
      DO SOMETHING
    }
  })
  .catch(errObj => {
    DO SOMETHING
  })
```
