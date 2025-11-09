export interface NotifType {
    type: string;
    message: string;
}

export type User = {
    uuid: string;
    imgUrl?: string;
    name: string;
    email: string;
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