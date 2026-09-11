import { Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Workouts from "./pages/Workouts";
import ExerciseDetail from "./pages/ExerciseDetail";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import { AppShell } from "./components/AppShell";
import { MemberGate, AdminGate } from "./components/Gates";
import { LanguageProvider } from "@/lib/i18n/language";

function MemberPage({ children }: { children: React.ReactNode }) {
  return (
    <MemberGate>
      <AppShell>{children}</AppShell>
    </MemberGate>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Toaster />
      <Routes>
      <Route path="/" element={<MemberPage><Home /></MemberPage>} />
      <Route path="/workouts" element={<MemberPage><Workouts /></MemberPage>} />
      <Route path="/exercises/:id" element={<MemberPage><ExerciseDetail /></MemberPage>} />
      <Route path="/profile" element={<MemberPage><Profile /></MemberPage>} />
      <Route
        path="/admin"
        element={
          <AdminGate>
            <AppShell>
              <Admin />
            </AppShell>
          </AdminGate>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </LanguageProvider>
  );
}
