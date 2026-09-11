import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { GeoLock } from "@/components/GeoLock";
import type { ReactNode } from "react";

function FullScreenMessage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh dot-grid flex items-center justify-center px-6 text-center">
      <div className="animate-fade-up">{children}</div>
    </div>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  // No login redirect: AutoAuth (in App) silently signs members in with the
  // shared account. While there is no session yet, just show the loader.
  const { user, isLoading } = useAuth();
  if (isLoading || !user) {
    return (
      <FullScreenMessage>
        <p className="font-display text-3xl tracking-wide">
          INFINITY<span className="text-primary">FITNESS</span>
        </p>
      </FullScreenMessage>
    );
  }
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
  const status = trpc.geo.status.useQuery(undefined, {
    refetchInterval: 60_000,
  });
  const gym = trpc.geo.myGym.useQuery();

  if (status.isLoading) {
    return (
      <FullScreenMessage>
        <p className="font-display text-3xl tracking-wide">
          INFINITY<span className="text-primary">FITNESS</span>
        </p>
      </FullScreenMessage>
    );
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
