import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/hero.png";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16">
        {/* Text Content */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
            Let AI Find & Apply Jobs for You
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Build your professional profile, discover jobs tailored to your
            skills, and let our AI automatically apply to the best opportunities.
            Your dream job is just a click away.
          </p>
          <div className="flex gap-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              Get Started
            </Link>
            <Link
              to="/jobs"
              className="bg-white text-gray-800 px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              Explore Jobs
            </Link>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="md:w-1/2 mt-10 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={heroImage}
            alt="AI Job Search Illustration"
            className="w-full max-w-md mx-auto"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-16 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our Platform?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <motion.div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-pink-50 p-6 rounded-3xl shadow-lg text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <motion.div
              key={index}
              className="bg-white p-6 rounded-3xl shadow-lg text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>


      <section className="px-6 md:px-16 py-16 bg-gradient-to-r from-blue-600 to-pink-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Land Your Dream Job?
        </h2>
        <p className="mb-6">
          Join thousands of job seekers who are accelerating their careers with AI.
        </p>
        <Link
          to="/register"
          className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}

export default Home;