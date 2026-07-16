import fs from "fs";
import path from "path";

const dir = path.join(
  process.cwd(),
  "src/app/components/Dashboard/AdminDashboard"
);
const skip = new Set(["AdminSidebar.jsx", "AdminHeader.jsx"]);
const replacements = [
  ["border-stone-200", "border-gray-100"],
  ["border-stone-100", "border-gray-100"],
  ["divide-stone-100", "divide-gray-100"],
  ["text-stone-850", "text-gray-800"],
  ["text-stone-800", "text-gray-800"],
  ["text-stone-700", "text-gray-700"],
  ["text-stone-600", "text-gray-600"],
  ["text-stone-500", "text-gray-500"],
  ["text-stone-400", "text-gray-400"],
  ["text-stone-300", "text-gray-300"],
  ["bg-stone-50/40", "bg-gray-50/40"],
  ["bg-stone-50", "bg-gray-50"],
  ["bg-stone-100", "bg-gray-100"],
  ["hover:bg-stone-50", "hover:bg-gray-50"],
  ["hover:bg-stone-100", "hover:bg-gray-100"],
  ["focus:border-stone-400", "focus:border-indigo-400"],
  ["placeholder-stone-400", "placeholder-gray-400"],
  ["#3d4f38", "#4f46e5"],
  ["#50604A", "#6366f1"],
  ["#9A5F4C", "#818cf8"],
  ["#f5f5f0", "#f9fafb"],
  ["bg-[#4f46e5]", "bg-indigo-600"],
  ["hover:bg-[#2d3f28]", "hover:bg-indigo-700"],
  ["text-[#4f46e5]", "text-indigo-600"],
  ["text-[#6366f1]", "text-indigo-500"],
  ["border-[#4f46e5]/20", "border-indigo-200"],
  [
    "bg-green-50 border border-indigo-200 text-indigo-600",
    "bg-indigo-50 border border-indigo-200 text-indigo-600",
  ],
];

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".jsx") || skip.has(file)) continue;
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, "utf8");
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(fp, content);
  console.log("Updated", file);
}
