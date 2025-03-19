export type UserProfile = {
  id: number;
  email: string;
  name: string;
  photo: string;
  rol: string | null;
  token?: string | null;
};