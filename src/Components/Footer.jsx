import "../style.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} WeatherApp | A Group Project</p>
    </footer>
  );
}

export default Footer;
