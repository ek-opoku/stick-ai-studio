import { Activity, Clapperboard, FolderOpen, HardDrive, Play, WandSparkles } from "lucide-react";
import { ScenePlaybackPreview } from "@/components/scene-player";
import { TimelineStudio } from "@/components/timeline";
import { api } from "@/lib/api";

async function loadStudioState() {
  try {
    const [health, projects, renders] = await Promise.all([
      api.health(),
      api.projects(),
      api.renders()
    ]);

    return { health, projects, renders };
  } catch {
    return {
      health: { status: "offline", storageRoot: "backend unavailable" },
      projects: [],
      renders: []
    };
  }
}

export default async function Home() {
  const { health, projects, renders } = await loadStudioState();

  return (
    <main className="min-h-screen">
      <section className="border-b border-line bg-panel">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Stick AI Studio</h1>
            <p className="mt-1 text-sm text-gray-600">Local animation workstation</p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm">
            <Activity className="h-4 w-4 text-moss" />
            <span>{health.status}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          {[
            { label: "Projects", icon: FolderOpen },
            { label: "Scenes", icon: Clapperboard },
            { label: "Generate", icon: WandSparkles },
            { label: "Render", icon: Play },
            { label: "Storage", icon: HardDrive }
          ].map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 rounded-md border border-line bg-white px-4 py-3 text-left text-sm font-medium hover:border-action"
              type="button"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="grid gap-6">
          <section className="rounded-md border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Workspace</h2>
              <span className="text-sm text-gray-500">{health.storageRoot}</span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Metric label="Projects" value={projects.length} />
              <Metric label="Queued renders" value={renders.filter((job) => job.status === "queued").length} />
              <Metric label="Finished renders" value={renders.filter((job) => job.status === "completed").length} />
            </div>
          </section>

          <section className="rounded-md border border-line bg-white p-5">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <div className="mt-4 divide-y divide-line">
              {projects.length === 0 ? (
                <p className="py-8 text-sm text-gray-500">No local projects yet.</p>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.sceneCount} scenes</p>
                    </div>
                    <span className="text-sm text-gray-500">{project.updatedAt}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-md border border-line bg-white p-5">
            <h2 className="text-lg font-semibold">Animation Timeline</h2>
            <TimelineStudio />
          </section>

          <section className="rounded-md border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Scene Playback</h2>
              <span className="text-sm text-gray-500">3 characters / layered sync</span>
            </div>
            <ScenePlaybackPreview />
          </section>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-[#fbfaf7] p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
