import UserDao from "../dao/User.ts";
import { UserProfile } from "../types/User.ts";

class UserRepository {
  public async findAllUsers() {
    return await UserDao.getAllUsers();
  }

  public async findAllDoctors(){
    return await UserDao.getAllDoctors();
  }

  public async saveUser(userInfo: UserProfile) {
    const userExists: boolean = await UserDao.getUserByEmail(userInfo.email);
    if (userExists) {
      return await UserDao.getUserById(userInfo.id);
    }
    return await UserDao.createUser(userInfo);
  }

  public async findUserById(id: string) {
    return await UserDao.getUserById(id);
  }

  public async removeUser(id: number) {
    return await UserDao.deleteUserById(id);
  }
}

export default new UserRepository();
