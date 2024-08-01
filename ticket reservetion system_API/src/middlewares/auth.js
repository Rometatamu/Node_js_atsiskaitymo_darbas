import jwt from "jsonwebtoken";

export const auth=(req, res, next)=>{
    const jwtToken=req.headers.authorization;
    const decryptedToken=jwt.verify(jwtToken, process.env.JWT_SECRET);
    if(!decryptedToken){
        return res.status(401).json({message: "Auth failed"});
    }
    req.body.userId=decryptedToken.userId;
    return next();
};