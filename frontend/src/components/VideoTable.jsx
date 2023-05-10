import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useColorMode } from "@chakra-ui/react";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

const columns = [
  {
    name: "Video Title",
    selector: (row) => row.title,
    sortable: true,
  },
  {
    name: "URL",
    selector: (row) => row.link,
    cell: (row) => (
      <a
        href={row.link}
        target="_blank"
        rel="noopener noreferrer"
        download="video.mp4"
        style={{ textDecoration: "underline" }}
      >
        Download Video
      </a>
    ),
  },
  {
    name: "Date",
    selector: (row) => row.date,
    sortable: true,
  },
  {
    name: "MIM-ViT Score",
    selector: (row) => row.score,
    sortable: true,
  },
];

createTheme("darkmoon", {
  text: {
    primary: "#edeeee",
    secondary: "#edeeee",
  },
  background: {
    default: "#2d3748",
  },
  context: {
    background: "#2d3748",
    text: "#FFFFFF",
  },
  divider: {
    default: "#5b6982",
  },
  highlightOnHover: {
    default: "#bce1f7",
    text: "rgba(0, 0, 0, 0.87)",
  },
  selected: {
    default: "#99c8ff",
    text: "rgba(0, 0, 0, 0.87)",
  },
});

createTheme("lightpara", {
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.87)",
  },
  background: {
    default: "#edf2f7",
  },
  context: {
    background: "#edf2f7",
    text: "rgba(0, 0, 0, 0.87)",
  },
  divider: {
    default: "#ccdae8",
  },
  highlightOnHover: {
    default: "#c7e2fc",
    text: "#3c5269",
  },
  selected: {
    default: "#c7e2fc",
    text: "#3c5269",
  },
});

function VideoTable() {
  const { colorMode } = useColorMode();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDownloadableLink = async (filePath) => {
    const dropboxApiUrl = "https://content.dropboxapi.com/2/files/download";
    const accessToken = "DROPBOX_API_KEY";

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Dropbox-API-Arg": JSON.stringify({ path: filePath }),
      "Content-Type": "application/octet-stream",
    };

    try {
      const response = await axios.post(dropboxApiUrl, null, {
        headers: headers,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const urlCreator = window.URL || window.webkitURL;
      const fileUrl = urlCreator.createObjectURL(blob);

      return fileUrl;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function fetchVideos() {
      try {
        const token = localStorage.getItem("api_access_token");
        const response = await axios.get("/get_videos", {
          headers: {
            "vit-api-authtoken": `Bearer ${token}`,
          },
        });
        let resp_data = response.data.videos;
        for (const video of resp_data) {
          const downloadableLink = await fetchDownloadableLink(video.URL);

          const linkElement = document.createElement("a");
          linkElement.href = downloadableLink;
          linkElement.textContent = "Download";
          video.link = linkElement;
          video.date = new Date(video.IST_date).toLocaleDateString();
          video.score = video.MIM_VIT_score;
          video.title = video.video_title;
        }
        setIsLoading(false);
        setData(resp_data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchVideos();
  }, []);

  return (
    <>
      {isLoading ? (
        <center>
          <Spinner />{" "}
        </center>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          selectableRowsHighlight={true}
          highlightOnHover={true}
          theme={colorMode === "dark" ? "darkmoon" : "lightpara"}
        />
      )}
    </>
  );
}

export default VideoTable;
