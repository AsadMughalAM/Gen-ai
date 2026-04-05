import "dotenv/config";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Server startup failed:", error.message);
  process.exit(1);
}


