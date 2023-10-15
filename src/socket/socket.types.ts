import {
  NOTIFICATION_ACTIONS,
  NOTIFICATION_COMMENTS,
  NOTIFICATION_TYPES,
} from './socket.enum';

export type NotificationStudyPayload = {
  type: NOTIFICATION_TYPES.STUDY;
  action: NOTIFICATION_ACTIONS.STUDY_REQUEST;
  comment: NOTIFICATION_COMMENTS.STUDY_REQUEST;
  contents: Contents;
  toUserId: string;
  fromUserId: string;
  studyName: string;
  time: Date;
  status: boolean;
};

export type Contents = { [type: string]: string };
