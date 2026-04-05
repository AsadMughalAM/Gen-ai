import jwt from 'jsonwebtoken'
import blacklistTokenModel from '../models/blacklist.model.js'

function resolveToken(req) {
   const cookieToken = req.cookies.token;
   const authHeader = req.headers.authorization;

   if (authHeader?.startsWith("Bearer ")) {
     return authHeader.substring(7).trim();
   }

   if (authHeader) {
     return authHeader.trim();
   }

   return cookieToken;
}

async function authuser(req,res,next){
   const token = resolveToken(req);

   if(!token){
    return res.status(401).json({
        message:"token not provided"
    })
   }

   const isTokenBlacklisted= await blacklistTokenModel.findOne({
    token
   })

   if(isTokenBlacklisted){
    return res.status(401).json({
        message:"token has been revoked"
    })
   }

   const secret = process.env.JWT_SECRET || process.env.JWT_Secret;
   if (!secret) {
     return res.status(500).json({ message: "JWT secret is not configured" });
   }

   try {
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()

   } catch (error) {
    return res.status(401).json({
        message: error.message,
    })
   }

}

export default authuser
