
import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    phone?: string;
  };
  authPayload?: any;
}

/**
 * 认证中间件
 * 为了兼容性，目前先进行 Token 解码。
 * 在生产环境中，请联系 SSO 团队获取公钥并开启 jwt.verify。
 */
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 降级方案：直接解码 JWT (不验证签名，仅用于当前环境调试)
    const decoded = jwt.decode(token) as any;
    
    if (!decoded || !decoded.sub) {
        throw new Error("Invalid token: sub missing");
    }

    // 检查是否过期
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
        throw new Error("Token expired");
    }

    req.user = { 
        id: decoded.sub, 
        email: decoded.email,
        phone: decoded.phone 
    };
    req.authPayload = decoded;
    
    next();
  } catch (err: any) {
    console.error("❌ Auth Error:", err.message);
    return res.status(403).json({ error: "Authentication failed: " + err.message });
  }
};
