import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decodedData = await jwt.verify(token, "secret");
    req.user = decodedData;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default auth
