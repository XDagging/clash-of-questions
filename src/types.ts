// import type { LargeNumberLike } from "crypto";

export interface NotifType {
    type: string;
    message: string;
}

export type User = {
    uuid: string;
    imgUrl?: string;
    name: string;
    email: string;
    trophies: number;
    questionType: {
      topic: string;
      difficulty: number;
      isMath: boolean;
    }
}

export type Question = {
  stimulus: string;
  stem: string; 
  questionId: string;
  answerChoices: string[];
  answer?: string;
  isMcq: boolean;
  studentInput?: string;
  type?: string;
};


export type Timeout = ReturnType<typeof setTimeout> | undefined;