import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () => setIsLight(document.documentElement.classList.contains("light"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-[82vh] flex flex-col items-center justify-center relative overflow-hidden px-4 pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#028090]/20 via-transparent to-[#b6465f]/20" />

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#028090]/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#b6465f]/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-5xl"
      >
        {/* Avatar */}
        <motion.div
          className="mb-6 inline-block"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 rounded-full p-1"
              style={{
                background: "linear-gradient(135deg, #028090, #b6465f)",
              }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(2, 128, 144, 0.3)",
                  "0 0 40px rgba(2, 128, 144, 0.5)",
                  "0 0 20px rgba(2, 128, 144, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <img
                src="https://github.com/TheFirstIstari.png"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent"
          style={{
            backgroundImage: isLight
              ? "linear-gradient(to right, #0a1a1e, #028090, #b6465f)"
              : "linear-gradient(to right, #fbfbff, #fbfbff, #028090)",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          TheFirstIstari
        </motion.h1>

        <motion.p
          className="mx-auto mb-6 max-w-3xl text-lg md:text-xl leading-relaxed"
          style={{ color: "var(--text-muted)" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Building local-first AI tools, realtime apps, astronomy visualisers, Minecraft systems, and weird performance experiments.
        </motion.p>

        {/* Links */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.a
            href="https://github.com/TheFirstIstari"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full border border-[#028090] text-[#028090] hover:bg-[#028090] hover:text-[#020202] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GitHub
          </motion.a>
          <motion.a
            href="https://instagram.com/TheFirstIstari"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full border border-[#b6465f] text-[#b6465f] hover:bg-[#b6465f] hover:text-[#fbfbff] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Instagram
          </motion.a>
          <motion.a
            href="/projects"
            className="px-6 py-3 rounded-full bg-[#028090] text-[#020202] font-medium hover:bg-[#028090]/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Projects
          </motion.a>
          <motion.a
            href="https://www.youtube.com/@TheFirstIstari"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full transition-colors hover:border-[#b6465f] hover:text-[#b6465f]"
            style={{
              border: isLight ? "1px solid rgba(10,26,30,0.3)" : "1px solid rgba(251,251,255,0.3)",
              color: isLight ? "rgba(10,26,30,0.75)" : "rgba(251,251,255,0.8)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            YouTube
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-[rgba(251,251,255,0.5)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}
