import calculatorImage from "@/assets/calculator-item.jpg";
import keysImage from "@/assets/keys-item.jpg";
import notebooksImage from "@/assets/notebooks-item.jpg";
import bottleImage from "@/assets/bottle-item.jpg";

export type ListingType = "lost" | "found" | "essential";
export type ListingStatus = "available" | "claimed";

export type BoardItem = {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  type: ListingType;
  status: ListingStatus;
  postedLabel: string;
  image?: string;
  price?: number;
};

export type BoardFilters = {
  query: string;
  category: string;
  location: string;
  type: "all" | "lost-found" | "essentials";
  status: "all" | ListingStatus;
};

export const sampleItems: BoardItem[] = [
  {
    id: "calculator",
    title: "Scientific calculator",
    category: "Electronics",
    location: "Central Library",
    description: "Found on a study table near the first-floor reading room.",
    type: "found",
    status: "available",
    postedLabel: "24 min ago",
    image: calculatorImage,
  },
  {
    id: "keys",
    title: "Keys with blue fabric tag",
    category: "Keys & accessories",
    location: "Student Centre",
    description: "A small bunch of keys, handed in at the front desk.",
    type: "found",
    status: "available",
    postedLabel: "1 hr ago",
    image: keysImage,
  },
  {
    id: "wallet",
    title: "Brown card wallet",
    category: "Wallets & cards",
    location: "OAT grounds",
    description: "Misplaced after the afternoon lecture. Has a student ID inside.",
    type: "lost",
    status: "available",
    postedLabel: "2 hrs ago",
  },
  {
    id: "id-card",
    title: "Student ID card",
    category: "Wallets & cards",
    location: "Library steps",
    description: "Collected and kept safely with the library desk.",
    type: "found",
    status: "claimed",
    postedLabel: "Yesterday",
  },
  {
    id: "notebooks",
    title: "Notebook + pen set",
    category: "Stationery",
    location: "Bookstore lane",
    description: "Two fresh notebooks and a pen, shared at student-friendly cost.",
    type: "essential",
    status: "available",
    postedLabel: "Today",
    image: notebooksImage,
    price: 35,
  },
  {
    id: "bottle",
    title: "Steel water bottle",
    category: "Bottles & containers",
    location: "Student Centre",
    description: "Clean, sturdy bottle from a fellow student. Ready to use.",
    type: "essential",
    status: "available",
    postedLabel: "Today",
    image: bottleImage,
    price: 80,
  },
  {
    id: "lab-coat",
    title: "Lab coat · size M",
    category: "Lab & class",
    location: "B Block",
    description: "Gently used and freshly washed. A lower-cost alternative to new.",
    type: "essential",
    status: "available",
    postedLabel: "Yesterday",
    price: 120,
  },
];

export const campusLocations = [
  "Central Library",
  "Student Centre",
  "OAT grounds",
  "Library steps",
  "Bookstore lane",
  "B Block",
];

export function filterCampusItems(items: BoardItem[], filters: BoardFilters): BoardItem[] {
  const query = filters.query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      [item.title, item.category, item.location, item.description].some((value) =>
        value.toLowerCase().includes(query),
      );
    const matchesCategory = filters.category === "All categories" || item.category === filters.category;
    const matchesLocation = filters.location === "All locations" || item.location === filters.location;
    const matchesType =
      filters.type === "all" ||
      (filters.type === "essentials" ? item.type === "essential" : item.type !== "essential");
    const matchesStatus = filters.status === "all" || item.status === filters.status;

    return matchesQuery && matchesCategory && matchesLocation && matchesType && matchesStatus;
  });
}

export function updateClaimStatus(items: BoardItem[], itemId: string): BoardItem[] {
  return items.map((item) =>
    item.id === itemId
      ? { ...item, status: item.status === "claimed" ? "available" : "claimed" }
      : item,
  );
}