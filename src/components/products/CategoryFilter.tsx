import { CATEGORIES } from '../../constants';

interface CategoryFilterProps {
  selected: string;
  onChange: (slug: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          !selected
            ? 'bg-[#00bcd4]/15 text-[#00bcd4] border border-[#00bcd4]/30'
            : 'bg-[#111827] text-[#94a3b8] border border-[#1e293b] hover:border-[#00bcd4]/30 hover:text-[#00bcd4]'
        }`}
      >
        Todas
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat.slug)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            selected === cat.slug
              ? 'bg-[#00bcd4]/15 text-[#00bcd4] border border-[#00bcd4]/30'
              : 'bg-[#111827] text-[#94a3b8] border border-[#1e293b] hover:border-[#00bcd4]/30 hover:text-[#00bcd4]'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
