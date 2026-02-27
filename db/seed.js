import dotenv from 'dotenv';
import connectDB from './database.js';
import { seedRoles } from './seedRoles.js';

dotenv.config();

const runSeed = async () => {
    try {
        console.log("🚀 Starting role seed process...");
        
        // Kết nối database
        await connectDB();
        
        // Seed roles
        const result = await seedRoles();
        
        if (result.success) {
            console.log("✅ Seed completed successfully!");
            process.exit(0);
        } else {
            console.error("❌ Seed failed:", result.message);
            process.exit(1);
        }
    } catch (error) {
        console.error("❌ Error running seed:", error);
        process.exit(1);
    }
};

runSeed();
