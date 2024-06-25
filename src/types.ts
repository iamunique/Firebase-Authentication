// src/types.ts

export interface RegisterRequestBody {
    email: string;
    password: string;
  }
  
  export interface LoginRequestBody {
    idToken: string;
  }
  
  export interface ResetPasswordRequestBody {
    email: string;
  }
  