import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      <p>© {new Date().getFullYear()} SusseAjla Event Bookings by Eventure. All rights reserved.</p>
    </motion.footer>
  );
}

  
  
  
  
//   export default function Footer() {
//   return (
//     <footer style={styles.footer}>
//       <p>© {new Date().getFullYear()} SusseAjla Event Bookings by Eventure. All rights reserved.</p>
//     </footer>
//   );
// }

// const styles = {
//   footer: {
//     background: "#f0f0f0",
//     padding: "1rem",
//     textAlign: "center",
//     marginTop: "2rem",
//   },
// };
