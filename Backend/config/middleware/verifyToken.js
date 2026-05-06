import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";  

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Access denied. Not Authenticated." 
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Attach both userId and full user object
    req.userId = payload.id;
    
    // Fetch user for name/username (needed for reviews)
    const user = await User.findById(payload.id).select("username name email");
    if (user) {
      req.user = user;
    }

    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userId === req.params.id) {
      next();
    } else {
      res.status(403).json({ 
        success: false, 
        message: "You are not allowed to do that!" 
      });
    }
  });
};