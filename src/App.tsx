import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const stats = [
    { title: "Activities", value: "12 tasks", path: "/activities" },
    { title: "Finance", value: "1.250.000 đ", path: "/finance" },
    { title: "Notes", value: "6 notes", path: "/notes" },
    { title: "Album", value: "24 photos", path: "/album" },
  ];

  const upcomingTodos = [
    { task: "Quay video giới thiệu sản phẩm", date: "Today" },
    { task: "Chỉnh sửa video YouTube", date: "Tomorrow" },
    { task: "Đăng bài marketing", date: "2 days" }
  ];

  const timeline = [
    { title: "Video TikTok", time: "10:00" },
    { title: "Edit video YouTube", time: "14:00" },
    { title: "Upload content", time: "20:00" }
  ];

  return (

    <div className="p-8 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
          Team Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Overview of activities, finance and media
        </p>
      </div>


      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {stats.map((card) => (

          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="cursor-pointer rounded-xl p-6 
            bg-gradient-to-br from-blue-900 to-purple-900 
            hover:scale-105 transition shadow-lg"
          >

            <p className="text-gray-300">{card.title}</p>

            <h2 className="text-2xl font-bold text-white mt-2">
              {card.value}
            </h2>

          </div>

        ))}

      </div>


      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-8">


        {/* TODO PREVIEW */}
        <div className="rounded-xl p-6 bg-slate-900 shadow-lg">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-semibold text-white">
              Upcoming Tasks
            </h2>

            <button
              onClick={() => navigate("/activities")}
              className="text-blue-400 text-sm"
            >
              View all
            </button>

          </div>

          <div className="space-y-3">

            {upcomingTodos.map((todo, i) => (

              <div
                key={i}
                className="flex justify-between bg-slate-800 p-3 rounded-lg"
              >
                <span className="text-gray-200">
                  {todo.task}
                </span>

                <span className="text-gray-400 text-sm">
                  {todo.date}
                </span>
              </div>

            ))}

          </div>

        </div>



        {/* CONTENT TIMELINE */}
        <div className="rounded-xl p-6 bg-slate-900 shadow-lg">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-semibold text-white">
              Content Timeline
            </h2>

            <button
              onClick={() => navigate("/content")}
              className="text-blue-400 text-sm"
            >
              View
            </button>

          </div>

          <div className="space-y-4">

            {timeline.map((item, i) => (

              <div
                key={i}
                className="flex justify-between border-b border-slate-700 pb-2"
              >
                <span className="text-gray-200">
                  {item.title}
                </span>

                <span className="text-cyan-400">
                  {item.time}
                </span>
              </div>

            ))}

          </div>

        </div>

      </div>



      {/* ALBUM PREVIEW */}
      <div className="rounded-xl p-6 bg-slate-900 shadow-lg">

        <div className="flex justify-between mb-4">

          <h2 className="text-xl font-semibold text-white">
            Album Preview
          </h2>

          <button
            onClick={() => navigate("/album")}
            className="text-blue-400 text-sm"
          >
            Open Album
          </button>

        </div>

        <div className="grid grid-cols-4 gap-4">

          {[1,2,3,4].map((img) => (

            <div
              key={img}
              className="h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
            />

          ))}

        </div>

      </div>

    </div>

  );

}
