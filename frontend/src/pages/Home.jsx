import { Grid, GridItem, Center, Progress } from "@chakra-ui/react";
import { React, useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import youtube from "../api/youtube";
import Navbar from "../components/Navbar";
import { useMediaQuery } from "@chakra-ui/react";
import Footer from "../components/Footer";

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;
  var seconds = Math.round(elapsed / 1000);
  var minutes = Math.round(elapsed / msPerMinute);
  var hours = Math.round(elapsed / msPerHour);
  var days = Math.round(elapsed / msPerDay);
  var months = Math.round(elapsed / msPerMonth);
  var years = Math.round(elapsed / msPerYear);

  if (elapsed < msPerMinute) {
    return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
  } else if (elapsed < msPerHour) {
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
  } else if (elapsed < msPerDay) {
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  } else if (elapsed < msPerMonth) {
    return days === 1 ? `${days} day ago` : `${days} days ago`;
  } else if (elapsed < msPerYear) {
    return months === 1 ? `${months} month ago` : `${months} months ago`;
  } else {
    return years === 1 ? `${years} year ago` : `${years} years ago`;
  }
}

// function convertViews(value) {
//   if (value >= 1000000) {
//     value = Math.round(value / 1000000) + "M views";
//   } else if (value >= 1000) {
//     value = Math.round(value / 1000) + "K views";
//   } else {
//     value = value + " views";
//   }
//   return value;
// }

function Home() {
  const [isLaptop] = useMediaQuery("(min-width: 1280px)");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const searchChange = (event) => {
    setSearch(event.target.value);
  };
  const searchSubmit = async (event) => {
    if (event.key === "Enter") {
      setLoading(true);
      const response = await youtube.get("/search", {
        params: {
          part: "snippet",
          q: search,
          type: "video",
        },
      });
      let processed_data = [];
      response.data.items.forEach(async (item) => {
        let current_date = new Date();
        let previous_date = new Date(item.snippet.publishedAt);
        let video = {};
        video.url = `https://www.youtube.com/watch?v=${item.id.videoId}`;
        video.thumbnail = item.snippet.thumbnails.high.url;
        video.title = item.snippet.title;
        video.channel = item.snippet.channelTitle;
        video.date = timeDifference(
          current_date.getTime(),
          previous_date.getTime()
        );
        // video.views = convertViews(video_response.statistics.viewCount);
        processed_data.push(video);
      });
      setVideos(processed_data);
      setLoading(false);
    }
  };
  const loadVideos = async () => {
    const response = await youtube.get("/videos", {
      params: {
        part: "snippet,statistics",
        chart: "mostPopular",
      },
    });
    let processed_data = [];
    response.data.items.forEach((item) => {
      let current_date = new Date();
      let previous_date = new Date(item.snippet.publishedAt);
      let video = {};
      video.url = `https://www.youtube.com/watch?v=${item.id}`;
      video.thumbnail = item.snippet.thumbnails.high.url;
      video.title = item.snippet.title;
      video.channel = item.snippet.channelTitle;
      video.date = timeDifference(
        current_date.getTime(),
        previous_date.getTime()
      );
      //   video.views = convertViews(item.statistics.viewCount);
      processed_data.push(video);
    });
    setVideos(processed_data);
    setLoading(false);
  };
  useEffect(() => {
    loadVideos();
  }, []);
  return (
    <>
      <Navbar
        searchable={true}
        search={search}
        searchChange={searchChange}
        searchSubmit={searchSubmit}
        setSearch={setSearch}
      />
      {loading ? (
        <Progress size="xs" isIndeterminate />
      ) : (
        <Center>
          <Grid
            mt="6"
            templateColumns={isLaptop ? "repeat(3, 1fr)" : "repeat(1, 1fr)"}
            gap={10}
          >
            {videos.map((video, key) => (
              <GridItem key={key}>
                <VideoCard video={video} />
              </GridItem>
            ))}
          </Grid>
        </Center>
      )}
      <Footer />
    </>
  );
}

export default Home;
