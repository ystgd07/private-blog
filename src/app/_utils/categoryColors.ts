export const categoryColors: Record<string, string> = {
  All: "bg-purple-500",
  JobSync: "bg-orange-500",
  "React.js": "bg-sky-500",
  "Next.js": "bg-green-500",
  TypeScript: "bg-blue-500",
  Infra: "bg-orange-500",
  Nest: "bg-red-500",
};

export const getCategoryColor = (category: string): string => {
  return categoryColors[category] || "bg-gray-500";
};
