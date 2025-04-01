"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import axios from "axios";
import VantaBackground from "./components/VantaBackground";

interface SearchResponse {
  context: {
    digits: string;
    pattern_index: number;
    pattern_length: number;
    start_position: number;
  };
  found: boolean;
  pattern: string;
  position: number;
  search_time_seconds: number;
  success: boolean;
}

function CountdownNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    animate(count, value, { duration: 2, ease: "easeOut" });
  }, [value, count]);

  return <motion.div>{rounded}</motion.div>;
}

function DigitsDisplay({ response }: { response: SearchResponse }) {
  const { digits, pattern_index, pattern_length } = response.context;
  const beforePattern = digits.slice(0, pattern_index);
  const pattern = digits.slice(pattern_index, pattern_index + pattern_length);
  const afterPattern = digits.slice(pattern_index + pattern_length);

  return (
    <div className="font-mono text-sm text-white/80 bg-black/20 p-4 rounded-lg overflow-x-auto">
      <div className="whitespace-nowrap">
        <span className="text-white/50">{beforePattern}</span>
        <span className="text-purple-400 font-bold">{pattern}</span>
        <span className="text-white/50">{afterPattern}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [number, setNumber] = useState("");
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!number) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`/api/search`, {
        pattern: number,
      });
      setResponse(response.data);
    } catch (err) {
      setError("Failed to fetch position");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <VantaBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            π Pattern Finder
          </h1>
          <p className="text-white/70 text-lg">
            Find where your number appears in the digits of π
          </p>
        </motion.div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter a number to find in π"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Searching π..." : "Find in π"}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {response && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-semibold text-white mb-2"
                  >
                    Found in π at Position
                  </motion.h2>
                  <motion.div
                    key={response.position}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl font-bold text-purple-400"
                  >
                    <CountdownNumber value={response.position} />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-semibold text-white text-center"
                  >
                    Pattern Found in π
                  </motion.h3>
                  <DigitsDisplay response={response} />
                  <div className="text-center text-white/70 space-y-2">
                    <p>
                      Pattern:{" "}
                      <span className="text-purple-400 font-bold">
                        {response.pattern}
                      </span>
                    </p>
                    <p>
                      Search Time: {response.search_time_seconds.toFixed(2)}{" "}
                      seconds
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
