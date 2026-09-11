import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Crosshair, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Gym } from "@db/schema";

type GymForm = {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  radiusMeters: string;
  active: boolean;
};

const emptyForm: GymForm = {
  name: "",
  address: "",
  latitude: "",
  longitude: "",
  radiusMeters: "100",
  active: true,
};

function GymEditor({
  id,
  initial,
  onDone,
}: {
  id?: number;
  initial: GymForm;
  onDone: () => void;
}) {
  const [form, setForm] = useState<GymForm>(initial);
  const utils = trpc.useUtils();
  const invalidate = () => {
    utils.admin.gyms.list.invalidate();
    onDone();
  };
  const createMutation = trpc.admin.gyms.create.useMutation({
    onSuccess: () => {
      toast.success("Gym created");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.admin.gyms.update.useMutation({
    onSuccess: () => {
      toast.success("Geofence updated");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const set = (k: keyof GymForm, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const fillFromGps = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        toast.success("Coordinates set from your current position");
      },
      () => toast.error("Could not read your position"),
      { enableHighAccuracy: true },
    );
  };

  const save = () => {
    const data = {
      name: form.name,
      address: form.address || undefined,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      radiusMeters: Number(form.radiusMeters),
      active: form.active,
    };
    if (id) updateMutation.mutate({ id, data });
    else createMutation.mutate(data);
  };

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Address</Label>
        <Input
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Latitude</Label>
          <Input
            value={form.latitude}
            onChange={(e) => set("latitude", e.target.value)}
            placeholder="12.971600"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Longitude</Label>
          <Input
            value={form.longitude}
            onChange={(e) => set("longitude", e.target.value)}
            placeholder="80.243100"
          />
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={fillFromGps}>
        <Crosshair className="h-4 w-4 mr-2" /> Use my current position
      </Button>
      <div className="space-y-1.5">
        <Label>Allowed radius (meters)</Label>
        <Input
          type="number"
          min={10}
          max={5000}
          value={form.radiusMeters}
          onChange={(e) => set("radiusMeters", e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Branch active</Label>
        <Switch
          checked={form.active}
          onCheckedChange={(v) => set("active", v)}
        />
      </div>
      <Button className="w-full" disabled={pending} onClick={save}>
        {id ? "Save geofence" : "Create gym"}
      </Button>
    </div>
  );
}

function GeofenceTest({ gyms }: { gyms: Gym[] }) {
  const [gymId, setGymId] = useState<string>("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const test = trpc.admin.geofenceTest.useMutation();
  const activeGymId = gymId || (gyms.find((g) => g.active)?.id ?? gyms[0]?.id);

  return (
    <section>
      <h2 className="font-display text-2xl tracking-wide mb-1">GEOFENCE TEST</h2>
      <p className="text-xs text-muted-foreground mb-3">
        Check any coordinates against a branch — no session is created.
      </p>
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="space-y-1.5">
          <Label>Branch</Label>
          <Select value={String(activeGymId ?? "")} onValueChange={setGymId}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gyms.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.name} ({g.radiusMeters}m)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Latitude</Label>
            <Input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="12.960293"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Longitude</Label>
            <Input
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="79.154320"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  setLat(pos.coords.latitude.toFixed(6));
                  setLng(pos.coords.longitude.toFixed(6));
                },
                () => toast.error("Could not read your position"),
                { enableHighAccuracy: true },
              )
            }
          >
            <Crosshair className="h-4 w-4 mr-2" /> Use my position
          </Button>
          <Button
            size="sm"
            disabled={test.isPending || !activeGymId || !lat || !lng}
            onClick={() =>
              test.mutate({
                gymId: Number(activeGymId),
                latitude: Number(lat),
                longitude: Number(lng),
                accuracy: 10,
              })
            }
          >
            Check
          </Button>
        </div>
        {test.data && (
          <p
            className={
              test.data.inside
                ? "text-sm font-medium text-green-500"
                : "text-sm font-medium text-primary"
            }
          >
            {test.data.inside ? "INSIDE" : "OUTSIDE"} the fence — {test.data.distance}m
            from {test.data.gymName} (radius {test.data.radiusMeters}m)
          </p>
        )}
      </div>
    </section>
  );
}

export default function AdminPage() {
  const gymsQuery = trpc.admin.gyms.list.useQuery();
  const membersQuery = trpc.admin.members.list.useQuery();
  const sessionsQuery = trpc.admin.locationSessions.recent.useQuery();
  const utils = trpc.useUtils();
  const assignMutation = trpc.admin.members.assignGym.useMutation({
    onSuccess: () => {
      utils.admin.members.list.invalidate();
      toast.success("Member reassigned");
    },
  });
  const revokeMutation = trpc.admin.locationSessions.revoke.useMutation({
    onSuccess: () => {
      utils.admin.locationSessions.recent.invalidate();
      toast.success("Session locked");
    },
    onError: (e) => toast.error(e.message),
  });
  const [editing, setEditing] = useState<number | "new" | null>(null);

  return (
    <div className="px-5 pt-6 space-y-8 pb-10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-5xl tracking-wide">GEOFENCE</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Branch coordinates live here — never in the app bundle.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditing("new")} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" /> New
        </Button>
      </div>

      <section className="space-y-3">
        {gymsQuery.isLoading && <Skeleton className="h-28 w-full rounded-2xl" />}
        {editing === "new" && (
          <GymEditor initial={emptyForm} onDone={() => setEditing(null)} />
        )}
        {(gymsQuery.data ?? []).map((g) =>
          editing === g.id ? (
            <GymEditor
              key={g.id}
              id={g.id}
              initial={{
                name: g.name,
                address: g.address ?? "",
                latitude: String(g.latitude),
                longitude: String(g.longitude),
                radiusMeters: String(g.radiusMeters),
                active: g.active,
              }}
              onDone={() => setEditing(null)}
            />
          ) : (
            <div
              key={g.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{g.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {g.latitude.toFixed(6)}, {g.longitude.toFixed(6)}
                  </p>
                </div>
                <span
                  className={
                    g.active
                      ? "text-[10px] uppercase tracking-widest text-primary"
                      : "text-[10px] uppercase tracking-widest text-muted-foreground"
                  }
                >
                  {g.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="font-display text-2xl text-primary">
                  {g.radiusMeters}m
                  <span className="text-xs text-muted-foreground ml-1">
                    radius
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(g.id)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ),
        )}
      </section>

      <GeofenceTest gyms={gymsQuery.data ?? []} />

      <section>
        <h2 className="font-display text-2xl tracking-wide mb-3">MEMBERS</h2>
        <div className="space-y-2">
          {(membersQuery.data ?? []).map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-border bg-card px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {m.user?.name ?? `User #${m.userId}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.membershipStatus}
                </p>
              </div>
              <Select
                value={String(m.gymId)}
                onValueChange={(v) =>
                  assignMutation.mutate({ userId: m.userId, gymId: Number(v) })
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(gymsQuery.data ?? []).map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-wide mb-1">
          PRESENCE EVENTS
        </h2>
        <p className="text-xs text-muted-foreground mb-3">
          Verification audit only — precise coordinates are never stored.
        </p>
        <div className="space-y-2">
          {(sessionsQuery.data ?? []).slice(0, 10).map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between text-xs"
            >
              <div>
                <p className="text-sm font-medium">User #{s.userId}</p>
                <p className="text-muted-foreground">
                  {new Date(s.verifiedAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={
                    s.status === "active"
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }
                >
                  {s.status}
                </p>
                <p className="text-muted-foreground">
                  {s.distanceFromGym != null
                    ? `${Math.round(s.distanceFromGym)}m from gym`
                    : ""}
                </p>
                {s.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    disabled={revokeMutation.isPending}
                    onClick={() => revokeMutation.mutate({ userId: s.userId })}
                  >
                    Lock now
                  </Button>
                )}
              </div>
            </div>
          ))}
          {sessionsQuery.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No verifications yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
