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

