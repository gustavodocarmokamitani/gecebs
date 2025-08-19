declare namespace Express {
  export interface Request {
    user: {
      userId: number;
      teamId: number;
      role: 'MANAGER' | 'ATHLETE';
    };
  }
}