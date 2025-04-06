import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { campus: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { campus: string };
    req.user = decoded; // Attach user data to request
    next(); // Move to next middleware
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return; // Explicitly return to satisfy TypeScript
  }
};

export default authMiddleware;
export { authMiddleware };
