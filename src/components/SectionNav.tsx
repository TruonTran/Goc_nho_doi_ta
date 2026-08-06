interface Props {
  sections: { id: string; label: string }[];
}

export default function SectionNav({ sections }: Props) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          title={s.label}
          className="w-2.5 h-2.5 rounded-full bg-white/25 hover:bg-neon-pink hover:shadow-glow-pink transition-all hover:scale-125"
          aria-label={s.label}
        />
      ))}
    </div>
  );
}
