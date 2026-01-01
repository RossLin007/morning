
import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    phone?: string;
  };
  authPayload?: JwtPayload;
}

// JWT 公钥配置
// 支持 PEM 格式公钥或 Base64 编码的密钥
const getJwtSecret = (): string | Buffer => {
  const publicKey = process.env.JWT_PUBLIC_KEY;
  const hmacSecret = process.env.JWT_SECRET;

  if (publicKey) {
    // 支持 PEM 格式（多行）或 Base64 编码
    if (publicKey.includes('-----BEGIN')) {
      return publicKey.replace(/\\n/g, '\n');
    }
    return Buffer.from(publicKey, 'base64');
  }

  if (hmacSecret) {
    return hmacSecret;
  }

  // 开发环境降级警告
  if (process.env.NODE_ENV !== 'production') {
    console.warn("⚠️ [Auth] No JWT_PUBLIC_KEY or JWT_SECRET configured. Using decode-only mode (INSECURE).");
    return '';
  }

  throw new Error("JWT verification key not configured");
};

const jwtSecret = getJwtSecret();
const jwtAlgorithm = process.env.JWT_ALGORITHM as jwt.Algorithm || 'RS256';

/**
 * 认证中间件
 * 验证 JWT Token 签名并提取用户信息
 */
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    let decoded: JwtPayload;

    if (jwtSecret) {
      // 🔒 生产模式：验证签名
      try {
        decoded = jwt.verify(token, jwtSecret, {
          algorithms: [jwtAlgorithm],
          clockTolerance: 30, // 允许 30 秒时钟偏差
        }) as JwtPayload;
      } catch (verifyError: any) {
        // 在开发环境下，如果签名验证失败（可能是因为配置了错误的 Key，或者使用的是模拟 Token），
        // 允许降级到仅解码模式，以便开发继续进行。
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`⚠️ [Auth] Token verification failed in DEV mode: ${verifyError.message}. Falling back to decode-only.`);
          decoded = jwt.decode(token) as JwtPayload;
        } else {
          throw verifyError;
        }
      }
    } else {
      // ⚠️ 开发模式：仅解码（不安全，仅限开发）
      decoded = jwt.decode(token) as JwtPayload;

      if (!decoded) {
        throw new Error("Invalid token format");
      }

      // 手动检查过期
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        throw new Error("Token expired");
      }
    }

    if (!decoded.sub) {
      throw new Error("Invalid token: sub missing");
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email as string | undefined,
      phone: decoded.phone as string | undefined,
    };
    req.authPayload = decoded;

    next();
  } catch (err: any) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' :
      err.name === 'JsonWebTokenError' ? 'Invalid token' :
        err.message;
    console.error("❌ Auth Error:", message);
    return res.status(403).json({ error: "Authentication failed: " + message });
  }
};
