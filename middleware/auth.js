import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../model/Userr.js";

//authentication middleware for both role base and check logged in
export default function authenticateUser(role) {
  return (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. Re-login" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== role) {
        return res.status(403).json({ error: "Access denied. Re-login" });
      }

      req.user = decoded.userId;
      req.role = decoded.role;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({error:"Access denied. Re-login"});
    }
  };
}



//authentication middleware for only to check logged in users

export const authenticateUserDetail = async (req, res, next) => {
  try {
    // Extract token from headers, cookies, or request body
    const token = req.header("auth-token"); // Assuming "Bearer <token>"

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. Re-login" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("decoded", decoded);

    // Fetch user from database using decoded token data
    req.user = await User.findById(decoded.userId);

    req.userId=await decoded.userId;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Access denied. Re-login" });
  }
};