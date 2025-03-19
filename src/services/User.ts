import UserRepository from "../repository/User.ts";
import { UserProfile } from "../types/User.ts";

class UserService {
  public async fetchAllUser() {
    return await UserRepository.findAllUsers();
  }

  public async fetchAuthUser(token: string) {
    return await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    ).then((res: Response) => res.json());
  }

  public async register(userInfo: UserProfile) {
    return await UserRepository.saveUser(userInfo);
  }

  public async removeUser(id: number) {
    return await UserRepository.removeUser(id);
  }
}

export default new UserService();
