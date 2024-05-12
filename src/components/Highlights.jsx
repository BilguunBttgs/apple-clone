import { rightImg, watchImg } from "@/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import VideoCarousel from "./VideoCarousel";

const Highlights = () => {
  useGSAP(() => {
    gsap.to("#title", { opacity: 1, y: 0 });
    gsap.to(".link", { opacity: 1, y: 0, duration: 1, stagger: 0.25 });
  }, []);
  return (
    <section
      id="highlights"
      className="w-screen overflow-hidden h-full common-padding bg-zinc relative z-10"
    >
      <div className="screen-max-width mb-12 w-full flex items-end justify-between">
        <h1 id="title" className="section-heading">
          Get the highlights
        </h1>
        <div className="flex flex-wrap items-end gap-5">
          <p className="link">
            Watch the film
            <img className="ml-2" src={watchImg.src} alt="watch" />
          </p>
          <p className="link">
            Watch the event
            <img className="ml-2" src={rightImg.src} alt="event" />
          </p>
        </div>
      </div>
      <VideoCarousel />
    </section>
  );
};

export default Highlights;
