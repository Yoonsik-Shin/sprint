export const enum NOTIFICATION_TYPES {
  STUDY = '스터디',
  INQUIRY = '문의',
}

export const enum NOTIFICATION_ACTIONS {
  STUDY_REQUEST = 'STUDY_REQUEST',
  STUDY_ACCEPT = 'STUDY_ACCEPT',
  STUDY_REJECT = 'STUDY_REJECT',
  INQUIRY_REGISTER = 'INQUIRY_REGISTER',
  INQUIRY_RESPONSE = 'INQUIRY_RESPONSE',
}

export const enum NOTIFICATION_COMMENTS {
  STUDY_REQUEST = '가입신청이 있습니다.',
  STUDY_ACCEPT = '가입신청이 수락되었습니다.',
  STUDY_REJECT = '가입신청이 거부되었습니다.',
  INQUIRY_REGISTER = '문의사항이 등록되었습니다.',
  INQUIRY_RESPONSE = '문의사항에 답변이 등록되었습니다.',
}
