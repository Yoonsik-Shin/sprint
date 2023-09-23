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



5. tsconfig.json에 경로설정

- 절대경로 지정

```
{
	"compilerOptions": {
		"paths": {
      		"..": ["./src/*"]
    	}
	}
}
```



6. DB 연결

```bash
$ nest g mo db
```

```bash
$ yarn add typeorm @nestjs/typeorm mysql2
```

- db.modules.ts에 Typeorm 설정추가



!! 오류 발생 

자동으로 코드 컨벤션 안바뀌는 오류

원인 : `.vscode/settings.json`에서 `setting.json`으로 오타냄



7. typeorm migration 설정 추가

- `type-orm.config.ts` 작성
- `dotenv` 설치 필요

```bash
$ yarn add dotenv
```

- `package.json` `scripts` 추가

```json
```



!!! 오류발생

- TypeOrmModule.forRootAsync에서 logging과 synchronize가 비정상적으로 동작
- 원인 : 해당 옵션에는 boolean값이 필요한데 환경변수에서 string 값을 받아서 무조건 true가 됨
- 해결 : 삼항연산자로 string값이 같으면 true, 아니면 false로 설정되도록 바꿈

```ts
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        synchronize: config.getOrThrow('DB_SYNC') === 'true' ? true : false,
        logging: config.getOrThrow('DB_LOG') === 'true' ? true : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
```

- 더 찾아보니 환경변수를 숫자 (`0`, `1`)를 준 후 옵션에서는 `Boolean()` 생성자 함수로 감쌈

```ts
synchronize: Boolean(process.env.DB_LOG),
```



## 코드 구현

```
```

### UserModule

