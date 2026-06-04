import { motion, useReducedMotion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  description?: string;
  command?: string;
}

export default function SectionTitle({ title, description, command }: SectionTitleProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text)' }}>
        <span style={{ color: 'var(--accent-2)' }}>❯ </span>
        {command ? (
          <>
            <span style={{ color: 'var(--accent)' }}>{command} </span>
            {title}
          </>
        ) : (
          title
        )}
      </h2>
      {description && (
        <p className="mt-2 text-sm max-w-2xl" style={{ color: 'var(--comment)' }}>
          // {description}
        </p>
      )}
    </motion.div>
  );
}
