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