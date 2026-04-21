"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  label: string;
  title: string;
  titleHighlight?: string;
  description: string;
  children?: React.ReactNode;
}

export default function PageHero({
  label,
  title,
  titleHighlight,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-label">{label}</div>
        <h1>
          {titleHighlight ? (
            <>
              {title}{" "}
              <em className="not-italic text-brand">{titleHighlight}</em>
            </>
          ) : (
            title
          )}
        </h1>
        <p>{description}</p>
        {children}
      </motion.div>
    </section>
  );
}
