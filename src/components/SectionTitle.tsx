import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  description?: string;
}

export default function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
        {title}
      </h2>
      {description && (
        <p className="max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
