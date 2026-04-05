import bcrypt from "bcryptjs";
console.log(await bcrypt.hash("admin123", 10));
