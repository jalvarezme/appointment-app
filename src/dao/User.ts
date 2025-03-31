import { UserProfile } from "../types/User.ts";
import { connection } from "./connection.ts";
class UserDao {
  public async getAllUsers() {
    const [rows] = await connection.query(`SELECT * FROM appointment_app.user`);
    return rows;
  }

  public async createUser(userInfo: UserProfile) {
    const { name, email, photo, id, rol } = userInfo;
    const [job] = await connection.createQueryJob(
      `INSERT INTO appointment_app.user (userId, email, name, profilePicture, createdAt, rol) VALUES ("${id}", "${email}", "${name}", "${photo}",  CURRENT_TIMESTAMP(), "${rol}")`,
    );

    return {
      userInfo,
      job: await job.getQueryResults(),
    };
  }

  public async getUserByEmail(email: string) {
    const [rows] = await connection.query(
      `SELECT COUNT(*) AS emailCount FROM \`appointment_app.user\` WHERE email = "${email}"`,
    );
    return rows[0].emailCount > 0;
  }

  public async getUserById(id: string) {
    const [rows] = await connection.query(
      `SELECT * FROM appointment_app.user WHERE userId = "${id}"`,
    );
    return rows[0];
  }

  public async getAllDoctors() {
    const [rows] = await connection.query(`SELECT * FROM appointment_app.user WHERE rol = "doctor"`);
    return rows;
  }

  public async deleteUserById(id: number) {
    const [job] = await connection.createQueryJob(
      `DELETE FROM appointment_app.user WHERE userId = "${id}"`,
    );
    return {
      id,
      delete: true,
      job: await job.getQueryResults(),
    };
  }
}
export default new UserDao();
