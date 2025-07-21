import * as authService from "../services/auth.service.js";

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: "Register successful", user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refreshAccessToken(refreshToken);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

const googleLogin = (req, res) => {
  const url = authService.generateGoogleAuthUrl();
  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const { payload, tokens } = await authService.googleLogin(code);

    // Lưu session
    req.session.user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'OAuth login failed');
  }
}

export default {
  register,
  login,
  refresh,
  logout,
  googleLogin,
  googleCallback,
};
