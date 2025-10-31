"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StorySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        unique: true,
        trim: true
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true
    },
    media: [{
            type: String,
            trim: true
        }],
    mediaPublicIds: [{
            type: String,
            trim: true
        }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const Story = (0, mongoose_1.model)('Story', StorySchema);
exports.default = Story;
/* model Story {
  id         Int       @id @default(autoincrement())
  title      String
  content    String?
  media      String?
  timestamp  DateTime  @default(now())
  Admin      Admin[]
}
  */ 
//# sourceMappingURL=Story.model.js.map