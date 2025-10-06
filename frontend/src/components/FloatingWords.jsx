import { motion } from "framer-motion";

const defaultCategories = ["Music", "Kids", "Sport", "Food", "Tech", "Art"];

export default function FloatingWords({ 
  categories = defaultCategories, 
  onSelect 
}) {
  return (
    <div className="floating-words">
      {categories.map((cat, i) => (
        <motion.span
          key={cat}
          className="floating-word"
          style={{
            top: `${15 + i * 12}%`,
            left: `${Math.random() * 80}%`,
          }}
          animate={{
            y: [0, 10, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 6 + Math.random() * 3,
            delay: Math.random() * 2,
          }}
          onClick={() => onSelect?.(cat)}
        >
          {cat}
        </motion.span>
      ))}
    </div>
  );
}
