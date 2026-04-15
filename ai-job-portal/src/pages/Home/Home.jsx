import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import heroImage from "../../assets/hero.png";

void motion;

const featureCards = [
  {
    title: "AI Job Matching",
    description:
      "Our intelligent system matches jobs based on your skills and preferences.",
    icon: Bot,
  },
  {
    title: "Auto Apply",
    description:
      "Automatically apply to actively hiring companies and save valuable time.",
    icon: Zap,
  },
  {
    title: "Professional Profile",
    description: "Create a LinkedIn-style profile to showcase your expertise.",
    icon: UserRound,
  },
  {
    title: "Application Tracking",
    description:
      "Monitor your job applications and interview progress in one place.",
    icon: BarChart3,
  },
];

const steps = [
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
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <motion.section
        className="relative isolate mx-auto flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:gap-16 lg:py-20"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            className="absolute left-6 top-10 hidden h-48 w-48 rounded-full bg-blue-200/40 blur-3xl sm:block"
            animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-6 bottom-0 hidden h-56 w-56 rounded-full bg-pink-200/40 blur-3xl sm:block"
            animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="relative w-full max-w-2xl text-center lg:w-1/2 lg:text-left"
          variants={itemVariants}
        >
          <motion.span
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm sm:text-sm"
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <Sparkles className="h-4 w-4" />
            AI Powered Job Search
          </motion.span>

          <motion.h1
            className="mb-5 text-3xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent sm:text-4xl lg:text-5xl"
            variants={itemVariants}
          >
            Let AI Find & Apply Jobs for You
          </motion.h1>

          <motion.p
            className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg"
            variants={itemVariants}
          >
            Build your professional profile, discover jobs tailored to your
            skills, and let our AI automatically apply to the best opportunities.
            Your dream job is just a click away.
          </motion.p>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            variants={itemVariants}
          >
            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 px-6 py-3 text-white shadow-lg transition sm:w-auto"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/jobs"
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-gray-800 shadow-lg transition sm:w-auto"
              >
                Explore Jobs
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative w-full overflow-hidden lg:w-1/2"
          variants={itemVariants}
        >
          <motion.div
            className="absolute left-4 top-4 hidden max-w-[14rem] rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block sm:left-6 sm:top-6"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Smart Matching
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Faster recommendations, less scrolling.
            </p>
          </motion.div>

          <motion.img
            src={heroImage}
            alt="AI Job Search Illustration"
            className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute bottom-4 right-4 hidden max-w-[14rem] rounded-2xl border border-pink-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block sm:bottom-6 sm:right-8"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">
              One Click Apply
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Lightweight on mobile, powerful on desktop.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="mx-auto w-full max-w-7xl bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.h2
          className="mb-10 text-center text-2xl font-bold sm:mb-12 sm:text-3xl"
          variants={itemVariants}
        >
          Why Choose Our Platform?
        </motion.h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6 lg:gap-8">
          {featureCards.map(({ title, description, icon: Icon }, index) => {
            void Icon;

            return (
              <motion.article
                key={title}
                className="rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 p-4 text-center shadow-lg sm:rounded-3xl sm:p-6"
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <motion.div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm"
                  whileHover={{ rotate: 8, scale: 1.05 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  {description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.h2
          className="mb-10 text-center text-2xl font-bold sm:mb-12 sm:text-3xl"
          variants={itemVariants}
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8">
          {steps.map((item, index) => (
            <motion.article
              key={item.step}
              className="rounded-2xl bg-white p-4 text-center shadow-lg sm:rounded-3xl sm:p-6"
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <motion.div
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-pink-500 text-lg font-bold text-white shadow-md sm:h-14 sm:w-14 sm:text-xl"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {item.step}
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mx-auto w-full max-w-7xl bg-gradient-to-r from-blue-600 to-pink-500 px-4 py-12 text-center text-white sm:px-6 sm:py-16 lg:px-16 rounded-3xl shadow-lg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.h2
          className="mb-4 text-2xl font-bold sm:text-3xl"
          variants={itemVariants}
        >
          Ready to Land Your Dream Job?
        </motion.h2>
        <motion.p
          className="mb-6 text-sm leading-relaxed sm:text-base"
          variants={itemVariants}
        >
          Join thousands of job seekers who are accelerating their careers with AI.
        </motion.p>
        <motion.div
          className="inline-flex"
          variants={itemVariants}
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg transition"
          >
            Sign Up Now
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default Home;
