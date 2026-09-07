import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../util/generateToken.js";

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return res.status(400).json({
        error: "User already exists with this email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    const token = generateToken(user.id, res);

    return res.status(201).json({
      message: "User registered successfully.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (!userExist) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    // Fixed: Issue the JWT / cookie on successful login
    const token = generateToken(userExist.id, res);

    return res.status(200).json({
      message: "Successfully logged in.",
      data: {
        user: {
          id: userExist.id,
          email: userExist.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Successfully logged out.",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

export { register, login, logout };