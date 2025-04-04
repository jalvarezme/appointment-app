export type UserProfile = {
  id: string;
  email: string;
  name: string;
  photo: string;
  rol: string | null;
  token?: string | null;
};