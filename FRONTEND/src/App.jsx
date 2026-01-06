import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/layout";

// pages
import Home from "./pages/home";
import About from "./pages/About";
import Aprea from "./pages/Aprea";
import Notifications from "./pages/Notification";
import Registration from "./pages/Registration";
import Reports from "./pages/Reports";
import Registered from "./pages/Registered";
import Judgements from "./pages/Judgement";
import KnowledgeHub from "./pages/KnowledgeHub";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="apreat" element={<Aprea />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="registration" element={<Registration />} />
          <Route path="reports" element={<Reports />} />
          <Route path="registered" element={<Registered />} />
          <Route path="judgements" element={<Judgements />} />
          <Route path="knowledge-hub" element={<KnowledgeHub />} />
          <Route path="login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
