import jsonwebtoken from "jsonwebtoken";

export default async function authenticateUser(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer "))
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });

  const token = auth.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing access token" });
  }
  try {
    const payload = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
