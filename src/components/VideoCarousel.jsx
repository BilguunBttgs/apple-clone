import { hightlightsSlides } from "@/constants";
import { pauseImg, playImg, replayImg } from "@/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVidoe: false,
    isPlaying: false,
  });
  const { isEnd, videoId, startPlay, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translate(${-100 * videoId}%)`,
      duration: 2,
      ease: "power3.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true }));
      },
    });
  }, [isEnd, videoId]);

  const [loadedData, setLoadedData] = useState([]);
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetaData = (i, e) => {
    setLoadedData((prev) => [...prev, e]);
  };

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progess = Math.ceil(anim.progress() * 100);
          if (progess != currentProgress) {
            currentProgress = progess;
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });
      if (videoId === 0) {
        anim.restart();
      }
      const animatUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };
      if (isPlaying) {
        gsap.ticker.add(animatUpdate);
      } else {
        gsap.ticker.remove(animatUpdate);
      }
    }
  }, [videoId, startPlay]);

  const handleProcces = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: i + 1,
        }));
        break;
      case "video-last":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: true,
        }));
        break;
      case "video-reset":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case "play":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      case "pause":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      default:
        return video;
    }
  };
  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, idx) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-xl overflow-hidden bg-black">
                <video
                  onEnded={() => {
                    idx !== 3
                      ? handleProcces("video-end", idx)
                      : handleProcces("video-last");
                  }}
                  onLoadedMetadata={(e) => {
                    handleLoadedMetaData(idx, e);
                  }}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  ref={(el) => (videoRef.current[idx] = el)}
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                >
                  <source src={list.video} />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p className="text-xl font-medium" key={text}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => {
                videoDivRef.current[i] = el;
              }}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                ref={(el) => {
                  videoSpanRef.current[i] = el;
                }}
                className="absolute h-full w-full rounded-full"
              ></span>
            </span>
          ))}
        </div>
        <button
          onClick={
            isLastVideo
              ? () => {
                  handleProcces("video-reset");
                }
              : !isPlaying
              ? () => handleProcces("play")
              : () => {
                  handleProcces("pause");
                }
          }
          className="control-btn"
        >
          <img
            src={
              isLastVideo
                ? replayImg.src
                : !isPlaying
                ? playImg.src
                : pauseImg.src
            }
            alt=""
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
