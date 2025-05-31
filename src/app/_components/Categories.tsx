import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getCategoryColor } from "../_utils/categoryColors";

interface CategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts: Record<string, number>;
}

const categories = [
  {
    name: "All",
  },
  {
    name: "JobSync",
    img: (
      <Image
        src='/JobSync_logo.png'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
  {
    name: "React.js",
  },
  {
    name: "Next.js",
  },
  {
    name: "TypeScript",
    img: (
      <Image
        src='/JobSync_logo.png'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
  {
    name: "Infra",
    img: (
      <Image
        src='/JobSync_logo.png'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
  {
    name: "Nest",
    img: (
      <Image
        src='/JobSync_logo.png'
        alt='category_logo'
        width={30}
        height={30}
      />
    ),
  },
];

export default function Categories({
  selectedCategory,
  onCategoryChange,
  categoryCounts,
}: CategoriesProps) {
  // 포스트가 있는 카테고리만 표시 (All은 항상 표시)
  const visibleCategories = categories.filter(
    (category) =>
      category.name === "All" ||
      (categoryCounts[category.name] && categoryCounts[category.name] > 0)
  );

  return (
    <section className='mb-8 max-w-5xl'>
      <h3 className='text-xl font-bold text-slate-800 mb-4'>카테고리 검색</h3>
      <div className='flex flex-wrap gap-3'>
        {visibleCategories.map((category) => {
          const isSelected = selectedCategory === category.name;
          const baseColor = getCategoryColor(category.name);

          return (
            <Button
              key={category.name}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onCategoryChange(category.name)}
              className={`${
                isSelected
                  ? `${baseColor} text-white border-0 hover:opacity-90`
                  : `hover:${baseColor} hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer`
              } relative font-semibold overflow-hidden group`}
            >
              {category.img && <span className='mr-2'>{category.img}</span>}
              <span className='relative z-10'>{category.name}</span>
              <Badge
                variant='secondary'
                className='ml-2 bg-white/20 text-current border-0'
              >
                {categoryCounts[category.name] || 0}
              </Badge>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
