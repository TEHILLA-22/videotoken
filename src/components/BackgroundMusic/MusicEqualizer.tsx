'use client';

export default function MusicEqualizer({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-5">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-1 rounded-full bg-[#7619bc] ${active ? 'animate-eq' : 'h-1'}`}
          style={{
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
