import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { trpc } from "@/providers/trpc";
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
import { hasManualLogout } from "@/lib/manual-logout";

/**
 * Shared-gym mode: no login screen. If there is no session, silently sign
 * in with the shared member account — unless the user explicitly signed out,
 * in which case they stay on /login until the next manual sign-in.
 * (/login stays available for the admin sign-in.)
 */
function AutoAuth() {
  const utils = trpc.useUtils();
  const me = trpc.auth.me.useQuery(undefined, { retry: false });
  const login = trpc.auth.loginPassword.useMutation({
    onSuccess: () => utils.invalidate(),
  });
  useEffect(() => {
    if (me.isError && !login.isPending && !hasManualLogout()) {
      login.mutate({ username: "trainee", password: "trainee123" });
    }
  }, [me.isError, login]);
  return null;
}

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
      <AutoAuth />
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
