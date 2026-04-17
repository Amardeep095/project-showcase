import { useScrollProgress } from "../../hooks/useScrollProgress";
import { motion } from "framer-motion";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="scroll-progress"
      style={{ width: `${progress}%` }}
    />
  );
}
