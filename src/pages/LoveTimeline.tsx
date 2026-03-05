import { useState } from "react"

type LoveEvent = {
  id: string
  title: string
  date: string
  description?: string
  location?: string
}

export default function LoveTimeline() {

  const [events] = useState<LoveEvent[]>([
    {
      id: "1",
      title: "First Time We Met",
      date: "2023-05-20",
      location: "Hà Nội",
      description: "First coffee together ☕"
    },
    {
      id: "2",
      title: "Trip to Đà Lạt",
      date: "2024-02-14",
      location: "Đà Lạt",
      description: "Our first travel together ✈️"
    },
    {
      id: "3",
      title: "1 Year Anniversary",
      date: "2025-01-20",
      location: "Home",
      description: "Romantic dinner 🍷"
    }
  ])

  return (

    <div className="p-8 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold text-center mb-10">
        ❤️ Our Love Timeline
      </h1>

      <div className="relative border-l-2 border-orange-300">

        {events.map((event) => (

          <div key={event.id} className="mb-10 ml-6">

            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-orange-500 rounded-full ring-8 ring-white" />

            <div className="bg-white shadow-lg rounded-xl p-4">

              <time className="text-sm text-gray-500">
                {event.date}
              </time>

              <h3 className="text-lg font-semibold mt-1">
                {event.title}
              </h3>

              {event.location && (
                <p className="text-sm text-gray-500">
                  📍 {event.location}
                </p>
              )}

              {event.description && (
                <p className="text-gray-600 mt-2">
                  {event.description}
                </p>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}