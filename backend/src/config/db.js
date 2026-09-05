import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: 
        process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Database connection successful");
    } catch (error) {
        console.log(`Database connection error: ${error}`);
    };
};

const disconnectDB = async () => {
    await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB }

