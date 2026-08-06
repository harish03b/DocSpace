import { loginApi, registerApi } from "./auth.api";

class AuthService {
  async login(data) {
    const response = await loginApi(data);

    return response.data;
  }

  async register(data) {
    const response = await registerApi(data);

    return response.data;
  }
}

export default new AuthService();