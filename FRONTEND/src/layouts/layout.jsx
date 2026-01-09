import Navbar from "../components/navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "70vh" }}>{children}</main>
      <Footer/>
    </>
  );
};

export default Layout;