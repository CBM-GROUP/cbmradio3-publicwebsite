"use client";

const programs = [
  {
    id: 'morning-mix',
    title: 'Morning Mix',
    host: 'Innocent Kato',
    time: '6:00 AM - 9:00 AM',
    description: 'Start your day with upbeat music, news headlines, and quick interviews.',
  },
  {
    id: 'midday-show',
    title: 'Midday Show',
    host: 'Brian Mugisha',
    time: '12:00 PM - 2:00 PM',
    description: 'Requests, local updates, and community spotlights.',
  },
  {
    id: 'evening-drive',
    title: 'Evening Drive',
    host: 'Samuel Peter',
    time: '5:00 PM - 8:00 PM',
    description: 'The best tracks to commute home with traffic updates and interviews.',
  },
];

export default function ProgramsSection() {
  return (
    <section className="bg-zinc-900 px-6 py-16 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-emerald-500 uppercase tracking-wide text-sm">Programs</p>
          <h2 className="mt-2 text-2xl font-bold">Our Shows</h2>
          <p className="mt-2 text-gray-400">Tune in to these programs for music, news and entertainment.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {programs.map((p) => (
            <article key={p.id} className="rounded-lg border border-zinc-800 bg-zinc-800 p-4">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-emerald-500">{p.host} • {p.time}</p>
              <p className="mt-2 text-sm text-gray-300">{p.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
