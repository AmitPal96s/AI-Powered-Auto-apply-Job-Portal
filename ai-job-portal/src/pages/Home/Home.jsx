import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <section className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:gap-16 lg:py-20">
        <div
          className="w-full max-w-2xl text-center lg:w-1/2 lg:text-left"
        >
          <h1 className="mb-5 text-3xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent sm:text-4xl lg:text-5xl">
            Let AI Find & Apply Jobs for You
          </h1>
          <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
            Build your professional profile, discover jobs tailored to your
            skills, and let our AI automatically apply to the best opportunities.
            Your dream job is just a click away.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 px-6 py-3 text-white shadow-lg transition hover:scale-105 sm:w-auto"
            >
              Get Started
            </Link>
            <Link
              to="/jobs"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-gray-800 shadow-lg transition hover:scale-105 sm:w-auto"
            >
              Explore Jobs
            </Link>
          </div>
        </div>

        <div
          className="w-full lg:w-1/2"
        >
          <img
            src={heroImage}
            alt="AI Job Search Illustration"
            className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-xl"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-16">
        <h2 className="mb-10 text-center text-2xl font-bold sm:mb-12 sm:text-3xl">
          Why Choose Our Platform?
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6 lg:gap-8">
          {[
            {
              title: "AI Job Matching",
              description:
                "Our intelligent system matches jobs based on your skills and preferences.",
              icon: "🤖",
            },
            {
              title: "Auto Apply",
              description:
                "Automatically apply to actively hiring companies and save valuable time.",
              icon: "⚡",
            },
            {
              title: "Professional Profile",
              description:
                "Create a LinkedIn-style profile to showcase your expertise.",
              icon: "👤",
            },
            {
              title: "Application Tracking",
              description:
                "Monitor your job applications and interview progress in one place.",
              icon: "📊",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 p-4 text-center shadow-lg sm:rounded-3xl sm:p-6"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xs font-bold tracking-widest text-blue-700 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-16">
        <h2 className="mb-10 text-center text-2xl font-bold sm:mb-12 sm:text-3xl">
          How It Works
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8">
          {[
            {
              step: "1",
              title: "Create Your Profile",
              description:
                "Add your skills, experience, and preferences to get personalized job recommendations.",
            },
            {
              step: "2",
              title: "Get Matched",
              description:
                "Our AI analyzes your profile and finds the most relevant job opportunities.",
            },
            {
              step: "3",
              title: "Apply Automatically",
              description:
                "Choose manual or automatic applications and track your progress effortlessly.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-4 text-center shadow-lg sm:rounded-3xl sm:p-6"
            >
              <div className="mb-2 text-2xl font-bold text-blue-600 sm:text-3xl">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl bg-gradient-to-r from-blue-600 to-pink-500 px-4 py-12 text-center text-white sm:px-6 sm:py-16 lg:px-16">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
          Ready to Land Your Dream Job?
        </h2>
        <p className="mb-6 text-sm leading-relaxed sm:text-base">
          Join thousands of job seekers who are accelerating their careers with AI.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 font-semibold text-blue-600 transition hover:scale-105"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}

export default Home;
