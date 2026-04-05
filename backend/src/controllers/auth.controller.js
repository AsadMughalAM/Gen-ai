import userModel from "../models/user.model.js";
import blacklistTokenModel from "../models/blacklist.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.JWT_Secret;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
}

function shouldUseSecureCookies(req) {
  if (process.env.COOKIE_SECURE === "true") {
    return true;
  }

  if (process.env.COOKIE_SECURE === "false") {
    return false;
  }

  return req.secure || req.headers["x-forwarded-proto"] === "https";
}

function getCookieOptions(req) {
  const secure = shouldUseSecureCookies(req);

  return {
    httpOnly: true,
    sameSite: secure ? "none" : "lax",
    secure,
    path: "/",
  };
}

async function registerUsercontroller(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      getJwtSecret(),
      {
        expiresIn: "1d",
      },
    );

    const authToken = typeof token === "string" ? token : String(token);
    res.cookie("token", authToken, getCookieOptions(req));

    return res.status(201).json({
      message: "User register Successfully",
      token: authToken,
      accessToken: authToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function loginUsercontroller(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "invalid password or email",
      });
    }

    const token = await jwt.sign(
      { id: user._id, username: user.username },
      getJwtSecret(),
      { expiresIn: "1d" },
    );

    const authToken = typeof token === "string" ? token : String(token);
    res.cookie("token", authToken, getCookieOptions(req));
    res.status(200).json({
      message: "user logged in successfully",
      token: authToken,
      accessToken: authToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function logoutUsercontroller(req, res) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies.token;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader || cookieToken;

  if (token) {
    try {
      await blacklistTokenModel.create({ token });
    } catch (error) {
      if (error?.code !== 11000) {
        throw error;
      }
    }
  }

  res.clearCookie("token", getCookieOptions(req));

  res.status(200).json({
    message: "user logged out successully",
  });
}

async function getMecontroller(req,res){
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "user details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}
export { registerUsercontroller, loginUsercontroller, logoutUsercontroller, getMecontroller };
