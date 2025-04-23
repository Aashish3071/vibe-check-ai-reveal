import React, { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Sparkles from "@/components/Sparkles";
import { toast } from "sonner";
import {
  PlusCircle,
  Heart,
  FlagIcon,
  Lightbulb,
  ArrowUpCircle,
  CalendarDays,
  Edit,
  Trash2,
} from "lucide-react";

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: "great" | "good" | "neutral" | "sad" | "terrible";
  flags: Array<{
    type: "green" | "red";
    text: string;
  }>;
  reflections: string;
  growthScore: number;
}

// Sample journal entries
const sampleEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2023-06-15",
    title: "First date with Alex",
    content:
      "Had an amazing first date at the rooftop bar downtown. The conversation flowed so naturally, and I didn't feel like I had to pretend to be someone else. There was a moment when our hands touched and I felt such a strong connection. Not sure if it's just me being hopeful though.",
    mood: "great",
    flags: [
      { type: "green", text: "Made me laugh throughout the date" },
      { type: "green", text: "Asked thoughtful questions about my life" },
      { type: "red", text: "Mentioned their ex twice" },
    ],
    reflections:
      "I need to remember not to get too excited too quickly. I've been hurt before by moving too fast.",
    growthScore: 85,
  },
  {
    id: "2",
    date: "2023-05-20",
    title: "Jordan ghosted me",
    content:
      "After three weeks of texting every day and two great dates, Jordan completely disappeared. No response to my texts for a week now. I'm trying not to take it personally, but it's hard not to replay everything in my mind wondering what I did wrong.",
    mood: "terrible",
    flags: [
      { type: "red", text: "Never made solid plans" },
      { type: "red", text: "Always texted late at night" },
      { type: "red", text: "Was vague about their past" },
    ],
    reflections:
      "Looking back, there were signs that they weren't fully invested. I need to pay more attention to actions rather than words next time.",
    growthScore: 60,
  },
  {
    id: "3",
    date: "2023-04-10",
    title: "Setting new boundaries",
    content:
      "I decided to take a break from dating apps for a month to focus on myself. Been journaling about what I really want in a relationship versus what I've been settling for. Feel more centered than I have in months.",
    mood: "good",
    flags: [
      { type: "green", text: "Prioritizing self-care" },
      { type: "green", text: "Being honest with myself" },
    ],
    reflections:
      "Sometimes stepping back is exactly what you need. I'm learning that being alone isn't the same as being lonely.",
    growthScore: 92,
  },
];

const moodEmojis = {
  great: "😍",
  good: "😊",
  neutral: "😐",
  sad: "😔",
  terrible: "😭",
};

const MoodBadge = ({ mood }: { mood: JournalEntry["mood"] }) => (
  <div
    className={`inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-medium ${
      mood === "great"
        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
        : mood === "good"
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
        : mood === "neutral"
        ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        : mood === "sad"
        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
    }`}
  >
    <span>{moodEmojis[mood]}</span>
    <span className="capitalize">{mood}</span>
  </div>
);

const FlagElement = ({ flag }: { flag: JournalEntry["flags"][0] }) => (
  <div
    className={`flex items-start gap-1 py-1 px-2 rounded-md text-xs ${
      flag.type === "green"
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
    }`}
  >
    <span className="mt-0.5">{flag.type === "green" ? "✅" : "🚩"}</span>
    <span>{flag.text}</span>
  </div>
);

const EntryForm = ({
  onSubmit,
  initialValues,
  isEdit = false,
}: {
  onSubmit: (entry: Omit<JournalEntry, "id">) => void;
  initialValues?: JournalEntry;
  isEdit?: boolean;
}) => {
  const [formData, setFormData] = useState<Omit<JournalEntry, "id">>({
    date: initialValues?.date || new Date().toISOString().split("T")[0],
    title: initialValues?.title || "",
    content: initialValues?.content || "",
    mood: initialValues?.mood || "neutral",
    flags: initialValues?.flags || [],
    reflections: initialValues?.reflections || "",
    growthScore: initialValues?.growthScore || 50,
  });

  const [newFlag, setNewFlag] = useState<{
    type: "green" | "red";
    text: string;
  }>({ type: "green", text: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please add a title for your journal entry!");
      return;
    }

    onSubmit(formData);
  };

  const addFlag = () => {
    if (!newFlag.text.trim()) return;

    setFormData({
      ...formData,
      flags: [...formData.flags, { ...newFlag }],
    });

    setNewFlag({ ...newFlag, text: "" });
  };

  const removeFlag = (index: number) => {
    setFormData({
      ...formData,
      flags: formData.flags.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mood">Mood</Label>
          <Select
            value={formData.mood}
            onValueChange={(value: JournalEntry["mood"]) =>
              setFormData({ ...formData, mood: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="How are you feeling?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="great">😍 Great</SelectItem>
              <SelectItem value="good">😊 Good</SelectItem>
              <SelectItem value="neutral">😐 Neutral</SelectItem>
              <SelectItem value="sad">😔 Sad</SelectItem>
              <SelectItem value="terrible">😭 Terrible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Give your entry a title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">What happened?</Label>
        <Textarea
          id="content"
          placeholder="Spill all the details..."
          className="min-h-[100px]"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Flags & Highlights</Label>
          <span className="text-xs text-muted-foreground">
            Track green flags and red flags
          </span>
        </div>

        <div className="flex items-end gap-2 mb-2">
          <Select
            value={newFlag.type}
            onValueChange={(value: "green" | "red") =>
              setNewFlag({ ...newFlag, type: value })
            }
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="green">✅ Green</SelectItem>
              <SelectItem value="red">🚩 Red</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Enter a flag..."
            value={newFlag.text}
            onChange={(e) => setNewFlag({ ...newFlag, text: e.target.value })}
            className="flex-1"
          />

          <Button type="button" size="sm" variant="secondary" onClick={addFlag}>
            Add
          </Button>
        </div>

        {formData.flags.length > 0 ? (
          <div className="space-y-2">
            {formData.flags.map((flag, index) => (
              <div key={index} className="flex items-center justify-between">
                <FlagElement flag={flag} />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFlag(index)}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No flags added yet
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reflections">Self-Reflection</Label>
        <Textarea
          id="reflections"
          placeholder="What did you learn? How did it make you feel?"
          className="min-h-[80px]"
          value={formData.reflections}
          onChange={(e) =>
            setFormData({ ...formData, reflections: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="growthScore">Emotional Growth Rating</Label>
          <span className="text-sm font-medium">{formData.growthScore}%</span>
        </div>
        <Input
          id="growthScore"
          type="range"
          min="0"
          max="100"
          value={formData.growthScore}
          onChange={(e) =>
            setFormData({ ...formData, growthScore: parseInt(e.target.value) })
          }
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Still Learning</span>
          <span>Growing</span>
          <span>Thriving</span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
      >
        {isEdit ? "Update Entry" : "Save Journal Entry"}
      </Button>
    </form>
  );
};

const JournalEntryCard = ({
  entry,
  onEdit,
  onDelete,
}: {
  entry: JournalEntry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg mb-4 overflow-hidden relative">
      <Sparkles count={3} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{entry.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(entry.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </CardDescription>
          </div>
          <MoodBadge mood={entry.mood} />
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <p className="text-sm">{entry.content}</p>

        {entry.flags.length > 0 && (
          <>
            <Separator className="my-3" />
            <div className="space-y-2">
              <p className="text-xs font-medium">Flags & Highlights:</p>
              <div className="flex flex-wrap gap-2">
                {entry.flags.map((flag, index) => (
                  <FlagElement key={index} flag={flag} />
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-3" />

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4 text-purple-500" />
            <p className="text-xs font-medium">Self-Reflection:</p>
          </div>
          <p className="text-xs italic">{entry.reflections}</p>
        </div>

        <Separator className="my-3" />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium flex items-center gap-1">
              <ArrowUpCircle className="h-4 w-4 text-pink-500" />
              Emotional Growth:
            </p>
            <span className="text-xs font-semibold">{entry.growthScore}%</span>
          </div>
          <Progress value={entry.growthScore} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="pt-3 justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(entry.id)}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(entry.id)}
          className="h-8"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

const GrowthSummary = ({ entries }: { entries: JournalEntry[] }) => {
  const averageGrowth =
    entries.length > 0
      ? Math.round(
          entries.reduce((sum, entry) => sum + entry.growthScore, 0) /
            entries.length
        )
      : 0;

  const greenFlags = entries
    .flatMap((entry) => entry.flags.filter((flag) => flag.type === "green"))
    .map((flag) => flag.text);

  const redFlags = entries
    .flatMap((entry) => entry.flags.filter((flag) => flag.type === "red"))
    .map((flag) => flag.text);

  const uniqueGreenFlags = [...new Set(greenFlags)];
  const uniqueRedFlags = [...new Set(redFlags)];

  const moodCounts = entries.reduce((counts, entry) => {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    return counts;
  }, {} as Record<JournalEntry["mood"], number>);

  const mostCommonMood =
    Object.entries(moodCounts).length > 0
      ? (Object.entries(moodCounts).sort(
          (a, b) => b[1] - a[1]
        )[0][0] as JournalEntry["mood"])
      : "neutral";

  return (
    <div className="space-y-4">
      <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg overflow-hidden relative">
        <Sparkles count={5} />
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Emotional Glow-Up</CardTitle>
          <CardDescription>
            Growth summary based on your journal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold">{averageGrowth}%</h3>
            <p className="text-muted-foreground text-sm">
              Average Growth Score
            </p>

            <div className="w-full mt-6">
              <Progress value={averageGrowth} className="h-3" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Beginning</span>
                <span>Growing</span>
                <span>Thriving</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg overflow-hidden relative">
          <Sparkles count={3} />
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Common Green Flags</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {uniqueGreenFlags.length > 0 ? (
              <ul className="text-xs space-y-2">
                {uniqueGreenFlags.slice(0, 3).map((flag, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-green-500 mt-0.5">✅</span>
                    <span>{flag}</span>
                  </li>
                ))}
                {uniqueGreenFlags.length > 3 && (
                  <li className="text-muted-foreground">
                    +{uniqueGreenFlags.length - 3} more
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                No green flags recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg overflow-hidden relative">
          <Sparkles count={3} />
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Red Flags to Watch</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {uniqueRedFlags.length > 0 ? (
              <ul className="text-xs space-y-2">
                {uniqueRedFlags.slice(0, 3).map((flag, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-red-500 mt-0.5">🚩</span>
                    <span>{flag}</span>
                  </li>
                ))}
                {uniqueRedFlags.length > 3 && (
                  <li className="text-muted-foreground">
                    +{uniqueRedFlags.length - 3} more
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                No red flags recorded yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg overflow-hidden relative">
        <Sparkles count={2} />
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 h-12 w-12 rounded-full flex items-center justify-center">
              <span className="text-2xl">{moodEmojis[mostCommonMood]}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Most frequent mood
              </p>
              <p className="font-medium capitalize">{mostCommonMood}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Journal = () => {
  const [activeTab, setActiveTab] = useState("entries");
  const [entries, setEntries] = useState<JournalEntry[]>(sampleEntries);
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const handleAddEntry = (newEntry: Omit<JournalEntry, "id">) => {
    const entry = {
      id: Date.now().toString(),
      ...newEntry,
    };

    setEntries([entry, ...entries]);
    setIsNewEntryDialogOpen(false);
    toast.success("Journal entry added! ✨", {
      description: "Your emotional growth journey is being tracked",
    });
  };

  const handleEditEntry = (updatedEntry: Omit<JournalEntry, "id">) => {
    if (!editingEntry) return;

    const updated = {
      ...updatedEntry,
      id: editingEntry.id,
    };

    setEntries(
      entries.map((entry) => (entry.id === editingEntry.id ? updated : entry))
    );

    setEditingEntry(null);
    toast.success("Journal entry updated! ✨");
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast.success("Journal entry deleted");
  };

  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
      <Header />
      <main className="container mx-auto px-4 max-w-md">
        <h2 className="text-2xl font-dancing text-center mb-2">
          My Emotional Glow-Up 📔
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Track your growth journey
        </p>

        <div className="flex justify-between items-center mb-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="entries">Journal</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog
            open={isNewEntryDialogOpen}
            onOpenChange={setIsNewEntryDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 w-8 p-0 ml-2"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Journal Entry</DialogTitle>
                <DialogDescription>
                  Document your relationship experiences and track your
                  emotional growth
                </DialogDescription>
              </DialogHeader>
              <EntryForm onSubmit={handleAddEntry} />
            </DialogContent>
          </Dialog>

          <Dialog
            open={!!editingEntry}
            onOpenChange={(open) => !open && setEditingEntry(null)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Journal Entry</DialogTitle>
                <DialogDescription>
                  Update your journal entry and reflections
                </DialogDescription>
              </DialogHeader>
              {editingEntry && (
                <EntryForm
                  onSubmit={handleEditEntry}
                  initialValues={editingEntry}
                  isEdit
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="entries" className="mt-0">
          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={(id) =>
                    setEditingEntry(entries.find((e) => e.id === id) || null)
                  }
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center p-6">
              <p>No journal entries yet</p>
              <Button
                onClick={() => setIsNewEntryDialogOpen(true)}
                variant="outline"
                className="mt-4"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Entry
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="growth" className="mt-0">
          <GrowthSummary entries={entries} />
        </TabsContent>
      </main>
      <Navigation />
    </div>
  );
};

export default Journal;
