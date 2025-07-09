export enum MessageTypeEnum {
  STATUS_UPDATE = "status-update",
  TRANSCRIPT = "transcript",
  SPEECH_UPDATE = "speech-update",
  MODEL_OUTPUT = "model-output",
  CONVERSATION_UPDATE = "conversation-update",
  USER_INTERRUPTED = "user-interrupted",
}

export enum MessageRoleEnum {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

export enum StatusUpdateTypeEnum {
  IN_PROGRESS = "in-progress",
  ENDED = "ended",
}

export enum TranscriptMessageTypeEnum {
  PARTIAL = "partial",
  FINAL = "final",
}

export enum SpeechUpdateStatusEnum {
  STARTED = "started",
  STOPPED = "stopped",
}

export interface StatusUpdateMessage extends BaseMessage {
  type: MessageTypeEnum.STATUS_UPDATE;
  status: StatusUpdateTypeEnum;
  endedReason?: "customer-ended-call";
}

export interface TranscriptMessage extends BaseMessage {
  type: MessageTypeEnum.TRANSCRIPT;
  role: MessageRoleEnum;
  transcriptType: TranscriptMessageTypeEnum;
  transcript: string;
}

export interface SpeechUpdateMessage extends BaseMessage {
  type: MessageTypeEnum.SPEECH_UPDATE;
  role: MessageRoleEnum;
  status: SpeechUpdateStatusEnum;
  turn: number;
}

export interface ModelOutputMessage extends BaseMessage {
  type: MessageTypeEnum.MODEL_OUTPUT;
  output: string;
}

export interface BaseMessage {
  type: MessageTypeEnum;
}

export type Message =
  | StatusUpdateMessage
  | TranscriptMessage
  | SpeechUpdateMessage
  | ModelOutputMessage;
