export interface RegisterInfo {
  id?: number;
  username: string;
  password: string;
  nickname: string;
  avatar?: string;
  code: string;
}
export interface LoginInfo {
  username: string;
  password: string;
  nickname: string;
}

export interface UserInfo {
    id: number
    username: string
    nickname: string
    avatar?: string
    create_time: string
}

export interface RagInfo {

    vector: number[]
    text: string
    time: string
}


export interface TextInfo {
    time:number
    text:string
}