import { useEffect, useState } from "react"

export default function LoveCounter() {

  const startDate = new Date("2024-01-20") // sửa ngày yêu ở đây

  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  })

  useEffect(() => {

    const updateCounter = () => {

      const now = new Date()
      const diff = now.getTime() - startDate.getTime()

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)

      setTimeTogether({ days, hours, minutes })
    }

    updateCounter()

    const timer = setInterval(updateCounter, 60000)

    return () => clearInterval(timer)

  }, [])

  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">

      <h1 className="text-3xl font-bold mb-6">
        ❤️ Our Love Counter
      </h1>

      <div className="bg-white shadow-xl rounded-3xl p-10">

        <p className="text-gray-500 mb-4">
          Together for
        </p>

        <div className="text-5xl font-bold text-orange-500">
          {timeTogether.days} days
        </div>

        <div className="text-lg text-gray-600 mt-2">
          {timeTogether.hours} hours • {timeTogether.minutes} minutes
        </div>

      </div>

    </div>
  )
}