import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExist = await prisma.user.findUnique({
            where: {email: email}
        });

        if(userExist){
            return res.json({
                error: "User already exist with this email."
            }), 400
        };

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashPassword,
            },
        });


        return res.json({
            data: {
                user: {
                    id: user.id,
                    email: email,
                    created_at: user.created_at,
                }
            }
        }), 201
    } catch (error) {
        throw error;
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExist = await prisma.user.findUnique({
            where: { email }
        });

        if (!userExist) {
            return res.status(400).json({
                error: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, userExist.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                error: "Invalid email or password"
            })
        }

        return res.status(200).json({
            message: "Successfully logged in."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong." });
    }
};

export { register, login }