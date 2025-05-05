import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOpenAI } from "@/common/hooks/useOpenAI";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AIModule,
  BestieModule,
  TherapistModule,
} from "@/common/services/aiModuleService";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"bestie" | "therapist">("bestie");
  const { generateResponse, setModule, getCurrentModule, isLoading } =
    useOpenAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      const response = await generateResponse(input);
      console.log("AI Response:", response);
      setInput("");
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  const handleModuleChange = (value: BestieModule | TherapistModule) => {
    setModule(value);
  };

  const getModuleDisplayName = (module: AIModule): string => {
    return module
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "bestie" | "therapist")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bestie">Dating Bestie</TabsTrigger>
          <TabsTrigger value="therapist">Therapist Bestie</TabsTrigger>
        </TabsList>
        <TabsContent value="bestie">
          <Select value={getCurrentModule()} onValueChange={handleModuleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Dating Bestie module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="decode-vibe">Decode Vibe</SelectItem>
              <SelectItem value="intent-detector">Intent Detector</SelectItem>
              <SelectItem value="pattern-recognizer">
                Pattern Recognizer
              </SelectItem>
              <SelectItem value="tarot-mode">Tarot Mode</SelectItem>
              <SelectItem value="journal-bestie">Journal</SelectItem>
            </SelectContent>
          </Select>
        </TabsContent>
        <TabsContent value="therapist">
          <Select value={getCurrentModule()} onValueChange={handleModuleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Therapist Bestie module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mood-checkin">Mood Check-in</SelectItem>
              <SelectItem value="self-coaching">Self Coaching</SelectItem>
              <SelectItem value="pattern-tracker">Pattern Tracker</SelectItem>
              <SelectItem value="prompted-journal">Prompted Journal</SelectItem>
              <SelectItem value="journal-therapist">Journal</SelectItem>
            </SelectContent>
          </Select>
        </TabsContent>
      </Tabs>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Talk to your ${getModuleDisplayName(
            getCurrentModule()
          )}...`}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            "Send"
          )}
        </Button>
      </form>
    </div>
  );
}
