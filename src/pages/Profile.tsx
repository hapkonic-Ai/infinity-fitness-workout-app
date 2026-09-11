import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/use-language";
import { flagManualLogout } from "@/lib/manual-logout";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const utils = trpc.useUtils();
  const gymQuery = trpc.geo.myGym.useQuery();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      // Stay signed out: suppress the shared-account auto sign-in and
      // return to the login screen.
      flagManualLogout();
      await utils.invalidate();
      navigate("/login");
      toast.success(t("profile.signedOut"));
    },
  });

  return (
    <div className="px-5 pt-6 space-y-6">
      <div className="flex items-center gap-4 animate-fade-up">
        <Avatar className="h-16 w-16 border border-border">
          {user?.avatar && <AvatarImage src={user.avatar} />}
          <AvatarFallback className="font-display text-2xl bg-card">
            {(user?.name ?? "A").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-4xl tracking-wide leading-none">
            {(user?.name ?? "Athlete").toUpperCase()}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {user?.email ?? t("profile.memberFallback")}
          </p>
        </div>
      </div>

      <section
        className="rounded-2xl border border-border bg-card p-5 animate-fade-up"
        style={{ animationDelay: "0.08s" }}
      >
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          {t("profile.assignedGym")}
        </p>
        {gymQuery.data ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{gymQuery.data.name}</p>
                {gymQuery.data.address && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {gymQuery.data.address}
                  </p>
                )}
              </div>
              <span className="font-display text-2xl text-primary whitespace-nowrap">
                {gymQuery.data.radiusMeters}m
              </span>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t("profile.gymLoading")}</p>
        )}
      </section>

      {user?.role === "admin" && (
        <Link to="/admin" className="block animate-fade-up">
          <div className="rounded-2xl border border-primary/40 bg-card p-5 flex items-center justify-between hover:border-primary transition-colors">
            <div>
              <p className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                {t("profile.adminLink")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("profile.adminSub")}
              </p>
            </div>
            <span className="font-display text-lg text-primary">→</span>
          </div>
        </Link>
      )}

      <button
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="w-full rounded-2xl border border-primary/40 bg-card p-5 flex items-center justify-between text-primary hover:border-primary transition-colors animate-fade-up"
        style={{ animationDelay: "0.12s" }}
      >
        <span className="font-display text-xl tracking-widest">
          {logout.isPending ? t("profile.signingOut") : t("profile.signOut")}
        </span>
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
}
