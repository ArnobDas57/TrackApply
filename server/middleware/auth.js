import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Get the Authorization header (case-insensitive)
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request object for later use
    req.user = decoded;
    next();
  } catch (error) {
    // Token verification failed
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};
