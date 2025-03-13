import { API_URL } from "@/modules/core/config/env";
import Comment from "@/modules/core/models/comment";
import axios from "axios";

export async function addCommentToVideo(videoId: number, comment: Comment) {
  await axios.post(`${API_URL}/comment/${videoId}`, comment)
}
