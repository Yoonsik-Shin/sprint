# 작업 순서

## 기본 설정

1. git 컨벤션 설정

```bash
$ yarn add -D commitizen cz-customizable
```

- `.cz-config.js` 파일 추가

```json
// package.json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable",
      "maxLineWidth": 0
    }
  }
}
```



2. app.module, app.service, app.controller 정리

3. 환경변수 설정 추가

```bash
$ yarn add @nestjs/config
```

- app.module.ts 파일 수정



!! 커밋 실수

- git rebase로 수정함

```bash
$ git rebase -i HEAD~돌아가고싶은커밋수
```



4. prettier, eslint, vscode editor 설정

- `.vscode/settings.json` 설정

```bash
$ yarn add -D eslint
$ yarn add -D prettier
```

- `.prettierrc`, `.eslintrc.js` 파일 작성



5. DB 연결

```bash
$ nest g mo db
```

```bash
$ yarn add typeorm @nestjs/typeorm mysql2
```

!! 오류 발생 

자동으로 코드 컨벤션 안바뀌는 오류

원인 : `.vscode/settings.json`에서 `setting.json`으로 오타냄



## 코드 구현

```
```

### UserModule

