import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../../data/users.json");

export class UserRepository {
  async readFile() {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.writeFile(filePath, "[]");
        return [];
      }
      throw error;
    }
  }

  async writeFile(users) {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
  }

  async findAll() {
    return await this.readFile();
  }

  async findById(id) {
    const users = await this.readFile();
    return users.find((user) => user.id === Number(id));
  }

  async findByEmail(email) {
    const users = await this.readFile();
    return users.find(
      (user) => user.email.toLowerCase() === String(email).toLowerCase()
    );
  }

  async create(data) {
    const users = await this.readFile();

    const newId =
      users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

    const newUser = new User(
      newId,
      data.name.trim(),
      data.email.trim(),
      Number(data.age)
    );

    users.push(newUser);
    await this.writeFile(users);

    return newUser;
  }

  async update(id, data) {
    const users = await this.readFile();
    const index = users.findIndex((user) => user.id === Number(id));

    if (index === -1) {
      return null;
    }

    users[index] = {
      ...users[index],
      name: data.name.trim(),
      email: data.email.trim(),
      age: Number(data.age)
    };

    await this.writeFile(users);
    return users[index];
  }

  async delete(id) {
    const users = await this.readFile();
    const filteredUsers = users.filter((user) => user.id !== Number(id));

    if (filteredUsers.length === users.length) {
      return false;
    }

    await this.writeFile(filteredUsers);
    return true;
  }
}