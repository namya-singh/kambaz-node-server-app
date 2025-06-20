// fixpasswords.js (in root)
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import UserModel from "./Kambaz/Users/model.js"; // Adjust path as needed

dotenv.config();

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const SALT_ROUNDS = 10;

const fixAllPasswords = async () => {
    await mongoose.connect(CONNECTION_STRING);
    console.log("✅ Connected to MongoDB");

    const users = await UserModel.find();
    console.log(`🔍 Found ${users.length} users`);

    for (const user of users) {
        const isHashed = user.password.startsWith("$2b$");

        if (!isHashed) {
            const hashed = await bcrypt.hash(user.password, SALT_ROUNDS);
            user.password = hashed;
            await user.save();
            console.log(`🔐 Fixed password for user: ${user.username}`);
        } else {
            console.log(`✅ Already hashed: ${user.username}`);
        }
    }

    await mongoose.disconnect();
    console.log("🚀 All done. Disconnected from DB.");
};

// Run only if script is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    fixAllPasswords()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error("❌ Error fixing passwords:", err);
            process.exit(1);
        });
}
