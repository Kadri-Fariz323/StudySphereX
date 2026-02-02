const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  // Use the same secret used during sign-in
  return jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify the token first
    const payload = verifyToken(token);

    // 3. Check for blocked status (payload should contain user data)
    // Note: This assumes 'status' was encoded in the JWT payload
    if (payload.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended.",
      });
    }

    // 4. Attach user to request
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;