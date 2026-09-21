import { useEffect, useState } from "react";
import { getReviews, type PublicReview } from "../../services/public/review.service";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews", error);
      }
    }

    loadReviews();
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];

  function previousReview() {
    setCurrentIndex((current) =>
      current === 0 ? reviews.length - 1 : current - 1,
    );
  }

  function nextReview() {
    setCurrentIndex((current) =>
      current === reviews.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <section
      id="reviews"
      className="bg-background py-28 text-foreground"
    >
      <div className="container-custom">
        {/* Heading */}
        <div className="relative flex items-center justify-center">
          <h2 className="text-center font-serif text-4xl leading-tight md:text-5xl">
            Stories of our
            <br />
            <span className="text-primary">
              Vyayamshala
            </span>{" "}
            Family
          </h2>

          {/* Arrows */}
          {reviews.length > 1 && (
            <div className="absolute right-0 hidden gap-8 md:flex">
              <button
                type="button"
                onClick={previousReview}
                className="text-4xl font-light transition hover:text-primary"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={nextReview}
                className="text-4xl font-light transition hover:text-primary"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Story */}
        <div className="mt-20 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          {/* Images */}
          <div className="relative min-h-[430px]">
            {currentReview.image1 && (
              <img
                src={currentReview.image1}
                alt="Vyayamshala member"
                className="absolute left-0 top-0 h-[330px] w-[245px] rounded-lg object-cover"
              />
            )}

            {currentReview.image2 && (
              <img
                src={currentReview.image2}
                alt="Vyayamshala member"
                className="absolute left-[205px] top-24 h-[230px] w-[185px] rounded-lg object-cover"
              />
            )}
          </div>

          {/* Quote */}
          <div className="max-w-xl">
            <div className="font-serif text-7xl leading-none">
              “
            </div>

            <p className="mb-5 mt-5 font-serif text-xl leading-8 md:text-2xl">
              {currentReview.review}
            </p>

            <span className="text-2xl tracking-wide">
              {"⭐".repeat(currentReview.rating)}
            </span>

            <p className="mt-3 font-serif text-sm md:text-md">
              {currentReview.member.user.name}, Member
            </p>

            <div className="font-serif text-7xl leading-none">
              “
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}