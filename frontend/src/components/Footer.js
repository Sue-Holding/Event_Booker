    export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} SusseAjla Event Bookings by Eventure. All rights reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#f0f0f0",
    padding: "1rem",
    textAlign: "center",
    marginTop: "2rem",
  },
};
