"use client";
import { useState, useEffect } from "react";



export default function CommentCarousel() {
  const [comments, setComments] = useState([]);
  const [index, setIndex] = useState(0);

  const [shimmerKey, setShimmerKey] = useState(0);

  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          const actualReviews = Array.isArray(data) ? data : [];
          setComments(actualReviews);
        } else {
          setComments([
            { name: "Dick B.", text: "Amazing work. Clean, professional, and fast. Highly recommend!", rating: 5 },
            { name: "Edith P.", text: "They transformed our yard completely. Communication was excellent.", rating: 5 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setComments([
          { name: "Nick G.", text: "Best landscaping experience we've ever had.", rating: 5 },
        ]);
      }
    }
    loadReviews();
  }, []);

  // Remove for boxes with loading sign
if (!comments.length && shimmerKey === 0) {
  return <p className="text-center">Loading reviews...</p>;
}

  const prev = () => {
    setIndex((i) => (i === 0 ? comments.length - 1 : i - 1));
    setShimmerKey((k) => k + 1);
  };

  const next = () => {
    setIndex((i) => (i === comments.length - 1 ? 0 : i + 1));
    setShimmerKey((k) => k + 1);
  };

  const getItem = (offset) =>
    comments[(index + offset + comments.length) % comments.length];

  const closeModal = () => setSelectedComment(null);


  //  heelo
  return (
    <>
      {/*                      mt-16 */}
    <div className="relative flex flex-col sm:flex-wrap justify-center w-full max-w-5xl mt-10 mx-auto px-4 bg-transparent">
      {/* <h2 className="text-3xl font-extrabold text-center border-b-2 p-2 border-[#477a40] inline-block mx-auto mb-7">
        What Our Clients Say
      </h2> */}


      {/* Added large gap between comment boxes so only in focus one is shown on mobile screens test different gaps (10 is good for all viewports*/}
<div className="relative flex items-center justify-center gap-10 h-63">
  <div className="hidden lg:block">
    <Bubble data={getItem(-1)} faded />
  </div>

  <Bubble data={getItem(0)} key={`focused-${shimmerKey}`} focused onCommentClick={() => setSelectedComment(getItem(0))} />

  <div className="hidden lg:block">
    <Bubble data={getItem(1)} faded />
  </div>
</div>

      <div className="flex justify-center gap-6 mt-5">
        <button
          onClick={prev}
          className="px-4 py-2 rounded-full border bg-white border-[#477a40] text-[#477a40] hover:bg-[#477a40] hover:text-white transition active:scale-95 hover:cursor-pointer"
        >
          ←
        </button>
        <button
          onClick={next}
          className="px-4 py-2 rounded-full border bg-white border-[#477a40] text-[#477a40] hover:bg-[#477a40] hover:text-white transition active:scale-95 hover:cursor-pointer"
        >
          →
        </button>
      </div>
    </div>

    {selectedComment && (
      <CommentModal comment={selectedComment} onClose={closeModal} />
    )}

  </>
  );
}

function Bubble({ data, focused, faded, onCommentClick }) {
  if (
    !data ||
    typeof data !== "object" ||
    typeof data.text !== "string" ||
    typeof data.name !== "string"
  ) {
    return (
      <div className="rounded-2xl p-6 shadow-lg w-72 border border-dashed border-[#477a40] bg-gray-50">
        <p className="text-sm leading-relaxed text-[#477a40]">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-2xl p-6 shadow-2xl transition-all duration-500 w-72 relative
        ${focused ? "scale-110 z-20 hover:cursor-pointer" : "z-0"}
        ${faded ? "scale-90 bg-white/80 text-gray-700" : "bg-white"}
      `}
      onClick={focused ? onCommentClick : undefined}
    >
      
      {focused && (
        <div className="absolute inset-0 bg-white z-10 rounded-2xl scale-[0.95]" />
      )}

      {focused && (
        <div className="absolute inset-0 bg-[#477a40] z-30 more-shimmer rounded-2xl" />
      )}


      <div className={`relative z-40 ${focused ? "text-white" : "text-gray-700"}`}>
        <p className={`text-sm leading-relaxed ${focused ? "more-shimmer" : ""} line-clamp-4`}
        role="button"
        aria-label={`Read full comment by ${data.name}`}
        >
          &quot;{data.text}&quot;
        </p>
        <p className={`mt-2 font-semibold ${focused ? "hidden" : ""}`}>★ {data.rating}</p>
        <p className={`mt-2 font-semibold ${focused ? "" : "hidden"}`}>⭐ {data.rating}</p>
        <p className="mt-4 font-bold text-right">— {data.name}</p>
      </div>
    </div>
  );
}


function CommentModal({ comment, onClose }) {
  return (
    <div 
      className="fixed inset-0  z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}  // Prevent closing when clicking inside
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Full comment */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {[...Array(comment.rating)].map((_, i) => (
              <span key={i} className="text-3xl text-yellow-400">⭐</span>
            ))}
          </div>
          <p className="text-lg leading-relaxed italic text-gray-800 max-w-3xl mx-auto">
            &quot;{comment.text}&quot;
          </p>
          <p className="mt-6 font-bold text-2xl text-[#477a40] tracking-wide">
            — {comment.name}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#477a40] text-white rounded-xl font-semibold hover:bg-[#3a6634] transition active:scale-95 hover:cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


// h-35
//  mt-2
// Add slide animation from comments out of focused to middle comment in focus

// ${focused ? "more-shimmer" : ""}





/**
 * export default function CommentCarousel() {
  const [index, setIndex] = useState(0);
  const [shimmerKey, setShimmerKey] = useState(0);

  const prev = () => {
    setIndex((i) => (i === 0 ? comments.length - 1 : i - 1));
    setShimmerKey((k) => k + 1);
  };

  const next = () => {
    setIndex((i) => (i === comments.length - 1 ? 0 : i + 1));
    setShimmerKey((k) => k + 1);
  };

  const getItem = (offset) =>
    comments[(index + offset + comments.length) % comments.length];

  return (
    <section className="relative w-full max-w-5xl mx-auto mt-20 px-4">
      <h2 className="text-3xl font-extrabold text-center mb-12 border-b-2 p-2 border-[#477a40] inline-block mx-auto">
        What Our Clients Say
      </h2>

       👇 HEIGHT-LOCKED STAGE 
      <div className="relative flex items-center justify-center gap-6 h-[260px]">
        <Bubble data={getItem(-1)} faded />
        <Bubble data={getItem(0)} key={`focused-${shimmerKey}`} focused />
        <Bubble data={getItem(1)} faded />
      </div>


      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={prev}
          className="px-4 py-2 rounded-full border border-[#477a40] text-[#477a40] hover:bg-[#477a40] hover:text-white transition active:scale-95"
        >
          ←
        </button>
        <button
          onClick={next}
          className="px-4 py-2 rounded-full border border-[#477a40] text-[#477a40] hover:bg-[#477a40] hover:text-white transition active:scale-95"
        >
          →
        </button>
      </div>
    </section>
  );
}

 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * function Bubble({ data, focused, faded }) {
  return (
    <div
      className={`
        w-72 rounded-2xl p-6 shadow-lg transition-transform duration-300
        ${focused ? "scale-110 bg-[#477a40] text-white z-10" : ""}
        ${faded ? "scale-90 bg-white text-gray-700 opacity-70" : ""}
      `}
    >
      <p className="text-sm leading-relaxed">“{data.text}”</p>
      <p className="mt-4 font-bold text-right">— {data.name}</p>
    </div>
  );
}

 * 
 * 
 * 
 * 
 * 
 */

