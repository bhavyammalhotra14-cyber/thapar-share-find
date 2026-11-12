import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownUp,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Filter,
  HandHeart,
  MapPin,
  PackageOpen,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  campusLocations,
  filterCampusItems,
  sampleItems,
  updateClaimStatus,
  type BoardFilters,
  type BoardItem,
  type ListingType,
} from "@/lib/campus-board";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thapar Campus Board | Lost & Found + Essentials" },
      {
        name: "description",
        content: "Find lost belongings, reunite useful items with their owners, and browse low-cost student essentials at Thapar Institute.",
      },
      { property: "og:title", content: "Thapar Campus Board | Lost & Found + Essentials" },
      {
        property: "og:description",
        content: "A student-powered place to find what's lost and share affordable essentials at Thapar Institute.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampusBoard,
});

const categories = [
  "Electronics",
  "Keys & accessories",
  "Wallets & cards",
  "Stationery",
  "Bottles & containers",
  "Lab & class",
  "Other",
];

const listingTypeOptions: { value: ListingType; label: string }[] = [
  { value: "lost", label: "Lost item" },
  { value: "found", label: "Found item" },
  { value: "essential", label: "Affordable essential" },
];

function CampusBoard() {
  const [items, setItems] = useState<BoardItem[]>(sampleItems);
  const [filters, setFilters] = useState<BoardFilters>({
    query: "",
    category: "All categories",
    location: "All locations",
    type: "all",
    status: "available",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [postType, setPostType] = useState<ListingType>("lost");
  const [preview, setPreview] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const visibleItems = useMemo(() => filterCampusItems(items, filters), [items, filters]);
  const lostFoundAvailable = items.filter((item) => item.type !== "essential" && item.status === "available").length;
  const essentialsAvailable = items.filter((item) => item.type === "essential" && item.status === "available").length;

  const setFilter = <K extends keyof BoardFilters>(key: K, value: BoardFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  const handlePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const location = String(data.get("location") ?? "");
    const category = String(data.get("category") ?? "");
    const description = String(data.get("description") ?? "").trim();
    const priceValue = Number(data.get("price"));
    const newItem: BoardItem = {
      id: crypto.randomUUID(),
      title,
      location,
      category,
      description,
      type: postType,
      status: "available",
      postedLabel: "Just now",
      ...(preview ? { image: preview } : {}),
      ...(postType === "essential" && Number.isFinite(priceValue) && priceValue >= 0
        ? { price: priceValue }
        : {}),
    };
    setItems((current) => [newItem, ...current]);
    setFilters({ query: "", category: "All categories", location: "All locations", type: "all", status: "available" });
    setDialogOpen(false);
    setPreview("");
    event.currentTarget.reset();
  };

  const handleClaim = (itemId: string) => setItems((current) => updateClaimStatus(current, itemId));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-foreground bg-background">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <a href="#top" className="flex items-center gap-3" aria-label="Thapar Campus Board home">
            <span className="flex size-10 items-center justify-center bg-foreground text-background">
              <PackageOpen className="size-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold">Campus Board</span>
              <span className="block text-xs font-semibold text-muted-foreground">THAPAR INSTITUTE</span>
            </span>
          </a>
          <div className="hidden items-center gap-2 text-sm font-semibold sm:flex">
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            Student-powered · Patiala
          </div>
          <Button onClick={() => setDialogOpen(true)} className="font-bold">
            <Plus aria-hidden="true" />
            <span className="hidden sm:inline">Post a listing</span>
            <span className="sm:hidden">Post</span>
          </Button>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-7 lg:px-10">
        <section className="grid gap-7 border-b-2 border-foreground py-8 md:grid-cols-[minmax(0,1fr)_300px] md:items-end md:py-12">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase">
              <span className="inline-block size-3 bg-primary" />
              Find it. Return it. Pass it on.
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl">
              Lost something?
              <br />
              <span className="underline decoration-campus-highlight decoration-[10px] underline-offset-[-3px]">You’re in the right place.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A shared campus board for finding important belongings and picking up everyday essentials without the full-price tag.
            </p>
          </div>
          <div className="grid grid-cols-2 border-2 border-foreground bg-card">
            <div className="border-r-2 border-foreground p-4 sm:p-5">
              <p className="font-display text-3xl font-extrabold">{lostFoundAvailable}</p>
              <p className="mt-1 text-xs font-bold uppercase leading-4">Items to reunite</p>
            </div>
            <div className="bg-campus-highlight p-4 sm:p-5">
              <p className="font-display text-3xl font-extrabold">{essentialsAvailable}</p>
              <p className="mt-1 text-xs font-bold uppercase leading-4">Essentials available</p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 pt-7 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10">
          <aside className="lg:sticky lg:top-5 lg:self-start">
            <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Filter className="size-4" aria-hidden="true" />
                Browse board
              </h2>
              <button
                type="button"
                className="text-xs font-bold underline underline-offset-4 lg:hidden"
                onClick={() => setMobileFiltersOpen((open) => !open)}
                aria-expanded={mobileFiltersOpen}
              >
                {mobileFiltersOpen ? "Hide" : "Filters"}
              </button>
            </div>
            <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
              <div className="py-5">
                <p className="mb-3 text-xs font-extrabold uppercase">Listing type</p>
                <div className="grid grid-cols-3 gap-1 border border-foreground p-1">
                  {([
                    ["all", "All"],
                    ["lost-found", "Lost + found"],
                    ["essentials", "Essentials"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilter("type", value)}
                      aria-pressed={filters.type === value}
                      className={`min-h-9 px-1 text-[11px] font-bold transition-colors ${filters.type === value ? "bg-foreground text-background" : "hover:bg-muted"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block border-t border-border py-5">
                <span className="mb-2 block text-xs font-extrabold uppercase">Category</span>
                <span className="relative block">
                  <select
                    value={filters.category}
                    onChange={(event) => setFilter("category", event.target.value)}
                    className="h-11 w-full appearance-none border border-input bg-card px-3 pr-9 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option>All categories</option>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4" aria-hidden="true" />
                </span>
              </label>
              <label className="block border-t border-border py-5">
                <span className="mb-2 block text-xs font-extrabold uppercase">Campus location</span>
                <span className="relative block">
                  <select
                    value={filters.location}
                    onChange={(event) => setFilter("location", event.target.value)}
                    className="h-11 w-full appearance-none border border-input bg-card px-3 pr-9 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option>All locations</option>
                    {campusLocations.map((location) => <option key={location}>{location}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4" aria-hidden="true" />
                </span>
              </label>
              <div className="border-t border-border py-5">
                <p className="mb-3 text-xs font-extrabold uppercase">Availability</p>
                <div className="flex gap-2">
                  {([
                    ["available", "Available"],
                    ["all", "All"],
                  ] as const).map(([value, label]) => (
                    <Button
                      key={value}
                      type="button"
                      variant={filters.status === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("status", value)}
                      aria-pressed={filters.status === value}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
              <section className="mt-1 border-2 border-foreground bg-campus-highlight p-4">
                <Sparkles className="mb-3 size-5" aria-hidden="true" />
                <h3 className="font-display font-bold">Good things go further.</h3>
                <p className="mt-2 text-sm leading-5">
                  Return a lost essential, or pass along a useful one at a student-friendly price. Less waste, less replacement spend.
                </p>
              </section>
            </div>
          </aside>

          <section aria-labelledby="listing-title" className="min-w-0">
            <div className="flex flex-col gap-4 border-b-2 border-foreground pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-extrabold uppercase text-muted-foreground">The latest from campus</p>
                <h2 id="listing-title" className="font-display text-2xl font-extrabold sm:text-3xl">Community listings</h2>
              </div>
              <Button onClick={() => setDialogOpen(true)} variant="outline" className="hidden sm:inline-flex">
                <Plus aria-hidden="true" /> Add a listing
              </Button>
            </div>

            <div className="flex flex-col gap-3 py-5 sm:flex-row">
              <label className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  value={filters.query}
                  onChange={(event) => setFilter("query", event.target.value)}
                  placeholder="Search item, category or place…"
                  aria-label="Search listings"
                  className="h-12 rounded-none border-foreground pl-10 text-sm"
                />
              </label>
              <div className="flex h-12 items-center gap-2 border border-input px-3 text-sm font-semibold text-muted-foreground">
                <ArrowDownUp className="size-4" aria-hidden="true" />
                <span>Newest first</span>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between text-sm">
              <p><span className="font-extrabold text-foreground">{visibleItems.length}</span> listings</p>
              <p className="hidden items-center gap-1 text-muted-foreground sm:flex"><ShieldCheck className="size-4" />Keep personal details private</p>
            </div>

            {visibleItems.length > 0 ? (
              <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((item) => <ListingCard key={item.id} item={item} onClaim={handleClaim} />)}
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center border-2 border-dashed border-border px-5 text-center">
                <PackageOpen className="size-8 text-muted-foreground" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-bold">Nothing here just yet</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">Try a different search or filter, or add a listing to help someone on campus.</p>
                <Button className="mt-5" onClick={() => setDialogOpen(true)}><Plus aria-hidden="true" /> Post a listing</Button>
              </div>
            )}
          </section>
        </div>

        <section className="mt-14 grid gap-5 border-t-2 border-foreground py-8 md:grid-cols-3 md:gap-8">
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center bg-campus-highlight"><HandHeart className="size-5" aria-hidden="true" /></span>
            <div><h2 className="font-display font-bold">Keep good things in use</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">Reuniting belongings means fewer important items get replaced or thrown away.</p></div>
          </div>
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center bg-campus-highlight"><ArrowRight className="size-5" aria-hidden="true" /></span>
            <div><h2 className="font-display font-bold">Spend less on essentials</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">Find a useful item at a low student-to-student price instead of buying new.</p></div>
          </div>
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center bg-campus-highlight"><CircleHelp className="size-5" aria-hidden="true" /></span>
            <div><h2 className="font-display font-bold">A little help goes a long way</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">One quick post can help a classmate find something they rely on every day.</p></div>
          </div>
        </section>
      </div>

      <PostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        postType={postType}
        onPostTypeChange={setPostType}
        onSubmit={handlePost}
        preview={preview}
        onImageChange={handleImageChange}
        onClearPreview={() => {
          setPreview("");
          if (fileInput.current) fileInput.current.value = "";
        }}
        fileInput={fileInput}
      />
    </main>
  );
}

function ListingCard({ item, onClaim }: { item: BoardItem; onClaim: (itemId: string) => void }) {
  const isClaimed = item.status === "claimed";
  const isEssential = item.type === "essential";
  const typeLabel = item.type === "lost" ? "LOST" : item.type === "found" ? "FOUND" : "LOW-COST ESSENTIAL";

  return (
    <article className={`flex min-w-0 flex-col border-2 border-foreground bg-card ${isClaimed ? "opacity-75" : ""}`}>
      <div className="relative aspect-[1.55/1] overflow-hidden border-b-2 border-foreground bg-muted">
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" width={816} height={816} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-secondary/60" aria-label="No item photo">
            <PackageOpen className="size-10 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        <span className={`absolute left-3 top-3 px-2.5 py-1 text-[10px] font-extrabold uppercase ${isEssential ? "bg-campus-highlight text-foreground" : item.type === "lost" ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>
          {typeLabel}
        </span>
        {isClaimed && <span className="absolute right-3 top-3 bg-foreground px-2.5 py-1 text-[10px] font-extrabold uppercase text-background">Claimed</span>}
        {isEssential && item.price !== undefined && (
          <span className="absolute bottom-3 right-3 bg-background px-3 py-1 font-display text-lg font-extrabold">₹{item.price}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-extrabold uppercase text-muted-foreground">{item.category}</span>
          <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-muted-foreground"><Clock3 className="size-3" aria-hidden="true" />{item.postedLabel}</span>
        </div>
        <h3 className="font-display text-lg font-bold leading-6">{item.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{item.description}</p>
        <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-semibold">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{item.location}</span>
        </div>
        <Button
          variant={isClaimed ? "outline" : "default"}
          className="mt-4 w-full font-bold"
          onClick={() => onClaim(item.id)}
          aria-label={isClaimed ? `Mark ${item.title} available` : `${isEssential ? "Check availability" : "Mark as claimed"}: ${item.title}`}
        >
          {isClaimed ? <><Check aria-hidden="true" /> Mark available</> : <>{isEssential ? <HandHeart aria-hidden="true" /> : <Check aria-hidden="true" />}{isEssential ? "Check availability" : "Mark as claimed"}</>}
        </Button>
      </div>
    </article>
  );
}

function PostDialog({
  open,
  onOpenChange,
  postType,
  onPostTypeChange,
  onSubmit,
  preview,
  onImageChange,
  onClearPreview,
  fileInput,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postType: ListingType;
  onPostTypeChange: (type: ListingType) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  preview: string;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearPreview: () => void;
  fileInput: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-none border-2 border-foreground sm:max-w-xl">
        <DialogHeader className="border-b-2 border-foreground pb-4 pr-8 text-left">
          <DialogTitle className="font-display text-2xl font-extrabold">Add to the board</DialogTitle>
          <DialogDescription>Help a fellow student find what they need.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset>
            <legend className="mb-2 text-xs font-extrabold uppercase">What are you posting?</legend>
            <div className="grid grid-cols-3 gap-2">
              {listingTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPostTypeChange(option.value)}
                  aria-pressed={postType === option.value}
                  className={`min-h-11 border px-2 text-xs font-bold ${postType === option.value ? "border-foreground bg-campus-highlight" : "border-input bg-background hover:bg-muted"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block text-xs font-extrabold uppercase">
            Item name
            <Input name="title" required maxLength={60} placeholder="e.g. Blue water bottle" className="mt-2 h-11 rounded-none text-sm font-normal normal-case" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-extrabold uppercase">
              Category
              <select name="category" required className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm font-normal normal-case focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="block text-xs font-extrabold uppercase">
              Campus location
              <select name="location" required className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm font-normal normal-case focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {campusLocations.map((location) => <option key={location}>{location}</option>)}
              </select>
            </label>
          </div>
          {postType === "essential" && (
            <label className="block text-xs font-extrabold uppercase">
              Student-friendly price (₹)
              <Input name="price" type="number" min="0" step="1" required placeholder="e.g. 50" className="mt-2 h-11 rounded-none text-sm font-normal normal-case" />
            </label>
          )}
          <label className="block text-xs font-extrabold uppercase">
            A few details
            <Textarea name="description" required maxLength={240} placeholder="Describe it or share anything helpful for pickup…" className="mt-2 min-h-20 rounded-none text-sm font-normal normal-case" />
          </label>
          <div>
            <span className="mb-2 block text-xs font-extrabold uppercase">Photo <span className="font-medium normal-case text-muted-foreground">· optional</span></span>
            <input ref={fileInput} type="file" accept="image/*" onChange={onImageChange} className="sr-only" aria-label="Choose a listing photo" />
            {preview ? (
              <div className="relative max-w-48 border border-border">
                <img src={preview} alt="Listing photo preview" className="aspect-video w-full object-cover" />
                <Button type="button" variant="secondary" size="icon" className="absolute right-1 top-1" onClick={onClearPreview} aria-label="Remove selected photo"><X /></Button>
              </div>
            ) : (
              <Button type="button" variant="outline" onClick={() => fileInput.current?.click()} className="w-full border-dashed">
                <Upload aria-hidden="true" /> Choose a photo
              </Button>
            )}
          </div>
          <div className="flex items-start gap-2 border-l-4 border-campus-highlight bg-muted p-3 text-xs leading-5 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Don’t include phone numbers, student IDs or other personal details in your post.
          </div>
          <Button type="submit" className="h-11 w-full font-bold"><Plus aria-hidden="true" /> Publish listing</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
