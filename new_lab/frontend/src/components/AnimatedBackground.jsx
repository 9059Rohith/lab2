import { motion } from 'framer-motion';

const symbols = ['+', '-', '×', '÷', '=', '<', '>', '%', '√', 'π'];

export default function AnimatedBackground() {
  return (
    <div className="symbol-bg" aria-hidden="true">
      {symbols.map((s, i) => (
        <motion.span
          key={`${s}-${i}`}
          className="symbol-float"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: -120, opacity: [0, 0.8, 0] }}
          transition={{
            duration: 8 + (i % 4),
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'linear'
          }}
          style={{ left: `${5 + i * 9}%` }}
        >
          {s}
        </motion.span>
      ))}
    </div>
  );
}
