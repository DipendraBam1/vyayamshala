import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/layout/Hero";
import Services from "./Services";
import ReviewsSection from "./Reviews";
import Footer from "../../components/layout/Footer";
import Facilities from "./Facilities";
import Trainers from "./Trainers";
import JoinFamily from "./JoinFamily";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <ReviewsSection />
      <Facilities />
      <Trainers />
      <JoinFamily />
 
      <Footer />
    </>
  );
}

export default Home;
