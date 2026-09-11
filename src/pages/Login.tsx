import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/providers/trpc";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Dumbbell } from "lucide-react";
import { useT } from "@/lib/i18n/use-language";
import { clearManualLogout } from "@/lib/manual-logout";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate();
  const t = useT();
  const utils = trpc.useUtils();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = trpc.auth.loginPassword.useMutation({
    onSuccess: async () => {
      clearManualLogout();
      await utils.invalidate();
      navigate("/");
    },
    onError: (e) => setError(e.message),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-dvh dot-grid flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-5">
            <Dumbbell className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-5xl leading-none tracking-wide">
            INFINITY<span className="text-primary">FITNESS</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-3 uppercase tracking-[0.3em]">
            {t("login.subtitle")}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-border bg-card p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="username">{t("login.username")}</Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t("login.password")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-xs text-primary font-medium">{error}</p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full font-display text-xl tracking-widest h-12"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "…" : t("login.submit")}
          </Button>
        </form>

        <button
          onClick={() => {
            window.location.href = getOAuthUrl();
          }}
          className="mt-5 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          or sign in with Kimi →
        </button>
      </div>
    </div>
  );
}
