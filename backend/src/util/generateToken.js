import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    const payload = {id: userId};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "3d"
    });
    res.cookie("jwt", token, {
        httpOnyly: true,
        secure: process.env.NODE_ENV === "production",
        samesite: "strict",
        maxAge: (1000 * 60 * 60 * 24) * 3
    });
    return token;   
}

export { generateToken };