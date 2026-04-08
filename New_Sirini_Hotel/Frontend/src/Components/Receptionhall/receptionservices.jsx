import React from "react";

export default function ReceptionServices() {
  const occasionCards = [
    {
      label: "Wedding party",
      desc: "Celebrate your big day in a venue that feels as magical as the moment. Elegant decor, grand spaces, and every detail curated to perfection",
      img: "https://www.lankaholidays.com/pics/40165/HANGOUT%20KURUNEGALA%20BANQUET%20HALL.jpg",
    },
    {
      label: "Birthday Celebrations",
      desc: "make birthdays extraordinary with personalized themes , entertainment setups, and a team dedicateeed to unforgettable fun",
      img: "https://gossip.hirufm.lk/data/photo-gallery/914-bhagya-039s-son-iyon-1st-birthday-party/edibag47.jpg",
    },
    {
      label: "Corporate events",
      desc: "from product launches to year-end parties, our tech-equipped and stylish spaces set the perfect tone for professional gathering",
      img: "https://www.americanexpress.com/de-de/amexcited/media/cache/teaser_image/cms/2025/11/einzigartigen-events-geschmueckter-raum-610-610-teaser-image-345.jpg?865900",
    },
  ];

  return (
    <section className="bg-neutral-200 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">

        {occasionCards.map((card, index) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-md">

            {/* Image */}
            <div className="h-64">
              <img
                src={card.img}
                alt={card.label}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Content */}
            <div className="bg-neutral-700 text-center px-6 py-8">

              {/* Title pill */}
              <div className="flex justify-center mb-4">
                <span className="bg-amber-500 text-black px-6 py-2 rounded-full text-sm font-semibold">
                  {card.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-200 italic text-sm leading-relaxed">
                {card.desc}
              </p>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
}