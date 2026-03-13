import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const workflowSteps = [
  {
    title: "Behavior Capture",
    description: "Keyboard timing and mouse dynamics are collected continuously with consent."
  },
  {
    title: "Feature Extraction",
    description: "Raw interactions are transformed into stable behavioral biomarkers."
  },
  {
    title: "Drift Detection",
    description: "Current behavior is compared with baseline cognitive fingerprint vectors."
  },
  {
    title: "Risk Forecast",
    description: "Future cognitive stability trends are predicted before visible symptoms."
  }
];

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" }
};

function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-80 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />

      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <p className="text-lg font-bold tracking-tight text-slate-900">NeuroPrint</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900">
              How It Works
            </a>
            <a href="#demo" className="text-slate-600 hover:text-slate-900">
              Demo
            </a>
            <a href="#about" className="text-slate-600 hover:text-slate-900">
              About
            </a>
            <Link to="/login" className="rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white">
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid min-h-[86vh] w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-2">
          <motion.div {...sectionReveal}>
            <p className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
              Cognitive Drift Intelligence
            </p>
            <h1 className="text-5xl font-bold leading-tight text-slate-900 sm:text-6xl">
              Your Behavior Knows Your Mind
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Detect Cognitive Drift Before Symptoms Appear.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
                Start Assessment
              </Link>
              <a
                href="#demo"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:border-slate-500"
              >
                View Demo
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6 shadow-2xl shadow-cyan-100/40"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Stability Score</p>
                <p className="mt-2 text-4xl font-bold text-emerald-700">87%</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Risk Status</p>
                <p className="mt-2 text-xl font-bold text-amber-700">Moderate Drift</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Prediction +30 days</p>
                <p className="mt-2 text-2xl font-bold text-cyan-700">84.5 Stability</p>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.section id="how-it-works" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8" {...sectionReveal}>
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.07, duration: 0.45 }}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-700">Step 0{index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="demo" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8" {...sectionReveal}>
          <h2 className="text-3xl font-bold text-slate-900">Demo Section</h2>
          <p className="mt-2 text-slate-600">Animated preview of dashboard intelligence panels.</p>

          <div className="mt-8 grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-700">Drift Timeline</p>
              <div className="mt-4 h-24 rounded-xl bg-gradient-to-r from-emerald-300/30 via-amber-300/30 to-red-300/30" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.4 }}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-700">Typing Rhythm</p>
              <div className="mt-4 h-24 rounded-xl bg-gradient-to-r from-cyan-400/25 to-emerald-400/25" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16, duration: 0.4 }}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-700">Forecast Confidence</p>
              <div className="mt-4 h-24 rounded-xl bg-gradient-to-r from-cyan-500/25 to-sky-500/25" />
            </motion.div>
          </div>
        </motion.section>

        <motion.section id="about" className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-8" {...sectionReveal}>
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="text-3xl font-bold text-slate-900">About NeuroPrint</h2>
            <p className="mt-4 max-w-3xl text-slate-600">
              NeuroPrint uses behavioral biometrics to estimate cognitive state through the way people type,
              move the mouse, and interact with interfaces over time. Instead of relying only on occasional
              clinical checkups, NeuroPrint continuously builds a cognitive fingerprint baseline and highlights
              subtle deviations early for proactive care and decision support.
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default LandingPage;
