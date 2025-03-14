export interface ProfileReq {
  user_id?: string;
}

export interface ProfileRes {
  user_id?: string;
  user_name?: string;
  avatar?: string;
  token?: string;
}

export interface LoginReq {
  login_name: string;
  password: string;
  captcha?: string;
}

export interface LoginRes {
  token: string;
  role: string;
  need_captcha: boolean;
}
