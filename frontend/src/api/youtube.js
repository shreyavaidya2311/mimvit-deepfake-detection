import axios from "axios";
const KEY = "YOUTUBE_API_KEY";

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    maxResults: 12,
    key: KEY,
  },
});
