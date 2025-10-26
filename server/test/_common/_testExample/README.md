# 테스트 모듈을 작성하는 예시가 있는 폴더이다.

# 다음 명령어로 테스트할 수 있다.

ts-node ./test/testExample/base.test.ts --LOG_LEVEL=7
ts-node ./test/testExample/tests/testModuleOK.test.ts --LOG_LEVEL=7
ts-node ./test/testExample/tests/testModuleFail.test.ts --LOG_LEVEL=7

# LOG_LEVEL 을 바꿔가며 해봐도 좋다.
