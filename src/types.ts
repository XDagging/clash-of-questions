export interface NotifType {
    type: string;
    message: string;
}

export type Timeout = ReturnType<typeof setTimeout> | undefined;