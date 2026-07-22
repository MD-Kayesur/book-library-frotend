"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I borrow a book?",
    answer: "Simply search for your desired title, click on the book, and hit the 'Borrow Now' button. The book will be instantly added to your digital library."
  },
  {
    question: "Is there a limit to how many books I can borrow?",
    answer: "Basic members can borrow up to 5 books simultaneously. Premium members have unlimited borrowing privileges."
  },
  {
    question: "Can I read offline?",
    answer: "Yes! Once you borrow a book, you can download it to your device and read it without an internet connection."
  },
  {
    question: "How do I return a book?",
    answer: "Books are automatically returned at the end of your 14-day lending period. You can also manually return them early from your 'My Books' section."
  },
  {
    question: "Do you offer audiobooks?",
    answer: "Absolutely. Many of our popular titles come with an audiobook version that you can listen to right from our built-in player."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <section className="w-full py-32 px-6 ">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-12 text-center drop-shadow-md"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="w-full border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-zinc-300 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
