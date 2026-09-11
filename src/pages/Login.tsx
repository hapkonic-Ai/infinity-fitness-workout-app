import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/providers/trpc";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useT } from "@/lib/i18n/use-language";
import { clearManualLogout } from "@/lib/manual-logout";

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
          <img
            src="/icons/icon-192.png"
            alt="Infinity Fitness"
            className="h-24 w-24 rounded-full border border-border mb-5"
          />
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
      </div>
    </div>
  );
}
