import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/app/HomePage";
import { ThankYouPage } from "@/app/ThankYouPage";
import { AdminPage } from "@/app/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gift/thank-you" element={<ThankYouPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
