import bcrypt from "bcrypt";

import { generateToken } from "../../shared/index.js";
import userRepository from "./user.repository.js";
class UserService {
  async createUser(userData) {
  const existingUser = await userRepository.findByEmail(userData.email);

  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await userRepository.create({
    ...userData,
    password: hashedPassword,
  });

  return user;
}

  async getUserByEmail(email) {
    return await userRepository.findByEmail(email);
  }

  async getUserById(userId) {
    return await userRepository.findById(userId);
  }
  async loginUser(email, password) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken({
    id: user._id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
}
}

export default new UserService();