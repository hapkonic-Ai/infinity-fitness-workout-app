import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { GeoLock } from "@/components/GeoLock";
import { flagManualLogout, hasManualLogout } from "@/lib/manual-logout";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";

function FullScreenMessage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh dot-grid flex items-center justify-center px-6 text-center">
      <div className="animate-fade-up">{children}</div>
    </div>
  );
}

const LOGO = (
  <FullScreenMessage>
    <p className="font-display text-3xl tracking-wide">
      INFINITY<span className="text-primary">FITNESS</span>
    </p>
  </FullScreenMessage>
);

/**
 * Shared-gym gate: fresh sessions are silently signed in with the shared
 * trainee account (kiosk mode). If sign-in is impossible — the user signed
 * out explicitly, or auto sign-in failed — redirect to /login instead of
 * dead-ending on the loader.
 */
function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const login = trpc.auth.loginPassword.useMutation({
    onSuccess: () => utils.invalidate(),
    onError: () => flagManualLogout(),
  });

  const unauthenticated = !isLoading && !user;

  useEffect(() => {
    if (
      unauthenticated &&
      !hasManualLogout() &&
      !login.isPending &&
      !login.isError &&
      !login.isSuccess
    ) {
      login.mutate({ username: "trainee", password: "trainee123" });
    }
  }, [unauthenticated, login]);

  useEffect(() => {
    if (unauthenticated && (hasManualLogout() || login.isError)) {
      navigate("/login", { replace: true });
    }
  }, [unauthenticated, login.isError, navigate]);

  if (isLoading || !user) return LOGO;
  return <>{children}</>;
}

/**
 * Member areas: authentication + a valid geofence session. When the member
 * has no active location authorization, they get the lock screen instead.
 */
export function MemberGate({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <GeoGate>{children}</GeoGate>
    </AuthGate>
  );
}

function GeoGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const status = trpc.geo.status.useQuery(undefined, {
    refetchInterval: 60_000,
    enabled: !isAdmin,
  });
  const gym = trpc.geo.myGym.useQuery();

  // Staff manage and test the fence from anywhere — no location check.
  if (isAdmin) return <>{children}</>;
  if (status.isLoading) {
    return LOGO;
  }
  if (!status.data?.unlocked) {
    return (
      <GeoLock
        gymName={gym.data?.name ?? "Infinity Fitness"}
        radiusMeters={gym.data?.radiusMeters ?? 100}
      />
    );
  }
  return <>{children}</>;
}

/** Admin area: authentication + admin role. */
export function AdminGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return (
    <AuthGate>
      {user?.role === "admin" ? (
        <>{children}</>
      ) : (
        <FullScreenMessage>
          <p className="font-display text-3xl tracking-wide">
            ADMIN ACCESS ONLY
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This area manages gym geofences and members.
          </p>
        </FullScreenMessage>
      )}
    </AuthGate>
  );
}
