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

- `.vscode/setting.json` 설정

```bash
$ yarn add -D eslint
$ yarn add -D prettier
```

- `.prettierrc` 파일 작성



