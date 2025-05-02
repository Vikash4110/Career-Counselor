import React, { useEffect } from "react";
import HeroSection from "../Components/HeroSection";
import Footer from "../Components/Footer";
import OurMission from "../Components/OurMission";
import Features from "../Components/Features";
import CTA from "../Components/CTA";
import Review from "../Components/Review";
import HowItsWork from "../Components/HowItsWork";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out",
      once: true,
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <>
      <HeroSection />
      <HowItsWork />
      <Review />
      <Features />
      {/* <CTA /> */}
      <Footer /> 
    </>
  );
};

export default Home;