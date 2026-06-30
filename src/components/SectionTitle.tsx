import { motion, useReducedMotion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  description?: string;
}

export default function SectionTitle({ title, description }: SectionTitleProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '2rem',
          letterSpacing: '0.04em',
          color: 'var(--text)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
