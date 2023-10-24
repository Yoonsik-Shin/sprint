-- AUTOINCREMENT 값 초기화
ALTER TABLE tech_stack AUTO_INCREMENT = 1;

-- 기술스택 삽입
INSERT INTO 
	tech_stack (`stackName`, `stackImg`) 
VALUES 
	('javascript', '/techStack/javascript.svg'),
  ('typescript', '/techStack/typescript.svg'),
	('node', '/techStack/node.svg'),
	('c', '/techStack/c.svg'),
	('c++', '/techStack/c++.svg'),
	('c#', '/techStack/csharp.svg'),
	('java', '/techStack/java.svg'),
	('kotlin', '/techStack/kotlin.svg'),
	('python', '/techStack/python.svg'),
	('rust', '/techStack/rust.svg'),
	('go', '/techStack/go.svg'),
	('php', '/techStack/php.svg'),
	('ruby', '/techStack/ruby.svg'),
	('swift', '/techStack/swift.svg'),
	('react', '/techStack/react.svg'),
  ('next', '/techStack/next.svg'),
	('spring', '/techStack/spring.svg'),
	('spring-boot', '/techStack/spring-boot.svg'),
  ('mysql','/techStack/mysql.svg')
;

-- AUTOINCREMENT 값 초기화
ALTER TABLE dev_career AUTO_INCREMENT = 1;

-- 개발경력 삽입
INSERT INTO
  dev_career (`category`)
VALUES
  ('신입 (1년미만)'),
  ('주니어 (1~3년)'),
  ('미들 (3~5년)'),
  ('시니어 (5년 이상)')
; 

-- AUTOINCREMENT 값 초기화
ALTER TABLE job AUTO_INCREMENT = 1;

-- 직무 삽입
INSERT INTO
  job (`category`)
VALUES
  ('백엔드'),
  ('프론트엔드'),
  ('데브옵스'),
  ('UI/UX 디자이너'),
  ('PM'),
  ('IT기획자'),
  ('DBA'),
  ('시스템 엔지니어'),
  ('네트워크 엔지니어'),
  ('데이터 분석가'),
  ('인공지능 개발자')
; 