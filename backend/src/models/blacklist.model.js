import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "token is required to be added in blacklist"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const blacklistTokenModel = mongoose.model("blacklistToken", blacklistTokenSchema);

export default blacklistTokenModel;