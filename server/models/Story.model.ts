import { model, Schema } from "mongoose";

const StorySchema = new Schema({
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
})

const Story = model('Story', StorySchema)
export default Story
/* model Story {
  id         Int       @id @default(autoincrement())
  title      String
  content    String?
  media      String?
  timestamp  DateTime  @default(now())
  Admin      Admin[]
}
  */