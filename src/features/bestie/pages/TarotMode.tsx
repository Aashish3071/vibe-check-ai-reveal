import React, { useState } from "react";
import Header from "@/common/components/Header";
import Navigation from "@/common/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import Sparkles from "@/common/components/Sparkles";
import { motion } from "framer-motion";
import { Textarea } from "@/common/components/ui/textarea";
import { toast } from "sonner";
import { Moon, Sun, Sparkles as SparklesIcon } from "lucide-react";

interface TarotCard {
  id: string;
  name: string;
  image: string;
  meaning: {
    present: string;
    hidden: string;
    future: string;
  };
}

const tarotDeck: TarotCard[] = [
  {
    id: "lovers",
    name: "The Lovers",
    image: "https://i.imgur.com/K4Qas0G.jpg",
    meaning: {
      present:
        "There's a strong connection between you two. The chemistry is undeniable, but this card asks if it's just passion or something deeper.",
      hidden:
        "One of you may be idealizing the other or the relationship. There might be a choice that needs to be made soon.",
      future:
        "This connection has potential for something meaningful if you can move beyond the surface attraction to real intimacy.",
    },
  },
  {
    id: "hermit",
    name: "The Hermit",
    image: "https://i.imgur.com/uTMIYW2.jpg",
    meaning: {
      present:
        "They're in a period of self-reflection right now. Their distant behavior isn't about you—they're trying to figure themselves out.",
      hidden:
        "They may be afraid of getting hurt, so they're pulling back to protect themselves. There's wisdom in this caution.",
      future:
        "After this introspection, they'll emerge with clearer intentions. Patience now could lead to a deeper connection later.",
    },
  },
  {
    id: "tower",
    name: "The Tower",
    image: "https://i.imgur.com/78uATk1.jpg",
    meaning: {
      present:
        "There's sudden change or disruption in this connection. What seemed stable might be shaken to its core.",
      hidden:
        "The foundation wasn't as solid as you thought. This upheaval is revealing truth that was always there beneath the surface.",
      future:
        "After destruction comes rebuilding. This clearing of illusions can lead to something more authentic, but only if you're both willing to start fresh.",
    },
  },
  {
    id: "fool",
    name: "The Fool",
    image: "https://i.imgur.com/YB0Irmf.jpg",
    meaning: {
      present:
        "You're at the beginning of something new and exciting. There's innocence and spontaneity in this connection.",
      hidden:
        "There may be naivety here—one or both of you might not be seeing potential pitfalls. Trust your intuition.",
      future:
        "This relationship has the freedom to evolve in many directions. Stay open to possibilities rather than forcing a specific outcome.",
    },
  },
  {
    id: "moon",
    name: "The Moon",
    image: "https://i.imgur.com/PcfMSxP.jpg",
    meaning: {
      present:
        "Things aren't as they appear. There's confusion or illusion clouding this situation, making it hard to see clearly.",
      hidden:
        "Unconscious patterns or fears are affecting how you relate to each other. What's triggering you might be from your past.",
      future:
        "As the moon waxes and wanes, so will this connection. Clarity will come, but you must first navigate through the shadows.",
    },
  },
  {
    id: "empress",
    name: "The Empress",
    image: "https://i.imgur.com/lQgk0Kg.jpg",
    meaning: {
      present:
        "There's nurturing energy between you. This connection feels emotionally abundant and fertile with possibilities.",
      hidden:
        "One of you may be giving more than receiving. Remember that true nurturing includes self-care too.",
      future:
        "This relationship has the potential to help both of you flourish and grow if you maintain a balance of giving and receiving.",
    },
  },
  {
    id: "star",
    name: "The Star",
    image: "https://i.imgur.com/HFv56mS.jpg",
    meaning: {
      present:
        "There's hope and inspiration in this connection. After difficult times, this relationship feels like a renewal.",
      hidden:
        "This person sees a special quality in you that others might miss. There's a spiritual dimension to your connection.",
      future:
        "Follow this gentle light. This relationship has healing potential that can guide you both toward greater authenticity.",
    },
  },
  {
    id: "chariot",
    name: "The Chariot",
    image: "https://i.imgur.com/bHV8gII.jpg",
    meaning: {
      present:
        "This connection is moving forward with determination. There's momentum and drive to overcome obstacles.",
      hidden:
        "There may be competing desires or forces at play. Success requires integrating these opposing energies.",
      future:
        "Victory is possible, but requires focused will and clear intention from both of you.",
    },
  },
];

const TarotCard = ({
  card,
  isFlipped,
  onClick,
  position,
}: {
  card: TarotCard;
  isFlipped: boolean;
  onClick: () => void;
  position: string;
}) => {
  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ scale: 0.8, opacity: 0, rotateY: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        rotateY: isFlipped ? 180 : 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: position === "present" ? 0 : position === "hidden" ? 0.2 : 0.4,
        },
      }}
      onClick={onClick}
    >
      <motion.div
        className={`relative w-full h-full rounded-xl shadow-xl transition-all duration-500 ${
          isFlipped ? "invisible" : "visible"
        }`}
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-xl aspect-[2/3] w-full max-w-[180px] flex flex-col items-center justify-center p-3 border-2 border-white/20">
          <div className="text-6xl mb-2 opacity-70">✨</div>
          <p className="text-white/70 text-center text-sm font-medium">
            Tap to reveal
          </p>
          <div className="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-[1px]"></div>
          <div className="absolute bottom-3 left-3 right-3 text-center text-xs text-white/60">
            {position === "present"
              ? "Present Energy"
              : position === "hidden"
              ? "Hidden Truth"
              : "Future Possibility"}
          </div>
        </div>
      </motion.div>

      <motion.div
        className={`absolute top-0 left-0 w-full h-full rounded-xl shadow-xl transition-all duration-500 ${
          isFlipped ? "visible" : "invisible"
        }`}
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="bg-gradient-to-br from-purple-700 to-pink-600 rounded-xl aspect-[2/3] w-full max-w-[180px] p-3 border-2 border-white/20 flex flex-col">
          <div className="text-white text-xs text-center font-medium mb-2">
            {card.name}
          </div>
          <div
            className="rounded-md bg-cover bg-center flex-1 mb-2 relative overflow-hidden"
            style={{ backgroundImage: `url(${card.image})` }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="text-white/90 text-[10px] text-center overflow-y-auto max-h-[80px] scrollbar-thin">
            {position === "present"
              ? card.meaning.present
              : position === "hidden"
              ? card.meaning.hidden
              : card.meaning.future}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TarotReading = ({
  situation,
  onReset,
}: {
  situation: string;
  onReset: () => void;
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({
    present: false,
    hidden: false,
    future: false,
  });

  // Select 3 random cards from the deck
  const [selectedCards] = useState(() => {
    const shuffled = [...tarotDeck].sort(() => 0.5 - Math.random());
    return {
      present: shuffled[0],
      hidden: shuffled[1],
      future: shuffled[2],
    };
  });

  const handleFlipCard = (position: string) => {
    setFlippedCards({
      ...flippedCards,
      [position]: true,
    });

    if (!flippedCards.present && position === "present") {
      toast("✨ The Present Energy revealed!", {
        description: "This card reflects what's happening now.",
      });
    } else if (!flippedCards.hidden && position === "hidden") {
      toast("🔮 The Hidden Truth uncovered!", {
        description: "This card shows what's beneath the surface.",
      });
    } else if (!flippedCards.future && position === "future") {
      toast("🌙 Future Possibility glimpsed!", {
        description: "This card suggests what may unfold.",
      });
    }
  };

  const allCardsFlipped =
    flippedCards.present && flippedCards.hidden && flippedCards.future;

  return (
    <div className="w-full">
      <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg overflow-hidden relative mb-6">
        <Sparkles count={5} />
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Your Mystical Reading ✨
          </CardTitle>
          <CardDescription>
            Based on: "
            {situation.length > 50
              ? situation.substring(0, 50) + "..."
              : situation}
            "
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <TarotCard
            card={selectedCards.present}
            isFlipped={flippedCards.present}
            onClick={() => handleFlipCard("present")}
            position="present"
          />
          <TarotCard
            card={selectedCards.hidden}
            isFlipped={flippedCards.hidden}
            onClick={() => handleFlipCard("hidden")}
            position="hidden"
          />
          <TarotCard
            card={selectedCards.future}
            isFlipped={flippedCards.future}
            onClick={() => handleFlipCard("future")}
            position="future"
          />
        </div>

        {allCardsFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg overflow-hidden relative">
              <Sparkles count={3} />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-lg font-medium">
                    Complete Reading
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  The cards have spoken, revealing the energies surrounding your
                  situation. This cosmic glimpse shows that
                  {selectedCards.present.name === "The Tower" ||
                  selectedCards.present.name === "The Moon"
                    ? " you're in a period of significant change or uncertainty. "
                    : " there's a meaningful energy around you right now. "}
                  What's hidden beneath the surface suggests
                  {selectedCards.hidden.name === "The Star" ||
                  selectedCards.hidden.name === "The Empress"
                    ? " there's more hope and nurturing available than you realize. "
                    : " there are deeper currents affecting this connection. "}
                  Moving forward,
                  {selectedCards.future.name === "The Lovers" ||
                  selectedCards.future.name === "The Star"
                    ? " the cosmic forces suggest potential for growth and deeper connection. "
                    : " you'll need to navigate carefully but with an open heart. "}
                </p>
                <p className="text-sm italic text-muted-foreground">
                  Remember, you co-create your destiny with the universe. These
                  cards offer guidance, but your choices shape your path. ✨
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={onReset}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                >
                  Pull Another Reading
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const TarotMode = () => {
  const [situation, setSituation] = useState("");
  const [isReading, setIsReading] = useState(false);

  const handleStartReading = () => {
    if (!situation.trim()) {
      toast.error("Enter your situation first, cosmic traveler! ✨");
      return;
    }

    setIsReading(true);
    toast("🔮 Reading the cosmic energies...", {
      description: "The cards are aligning for your reading",
    });
  };

  const handleReset = () => {
    setIsReading(false);
    setSituation("");
  };

  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-950/20 to-indigo-950/30 dark:from-purple-950/30 dark:to-indigo-950/30">
      <Header />
      <main className="container mx-auto px-4 max-w-md">
        <h2 className="text-2xl font-dancing text-center mb-2">
          Pull a Card on Them 🔮
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Mystical insights for your situation
        </p>

        {!isReading ? (
          <Card className="gradient-card border-white/30 dark:border-purple-800/30 shadow-lg overflow-hidden relative">
            <Sparkles count={5} />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cosmic Tarot Reading</CardTitle>
              <CardDescription>
                Share your relationship situation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Moon className="text-purple-400 h-4 w-4" />
                <div className="h-0.5 w-4 bg-gradient-to-r from-purple-400 to-transparent"></div>
                <div className="text-xl">🔮</div>
                <div className="h-0.5 w-4 bg-gradient-to-r from-transparent to-pink-400"></div>
                <Sun className="text-pink-400 h-4 w-4" />
              </div>

              <Textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="What's on your mind? (e.g., 'Does he like me?' or 'Should I text them first?')"
                className="min-h-[100px] mb-4 dreamy-input"
              />

              <Button
                onClick={handleStartReading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
              >
                Pull the Cards ✨
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TarotReading situation={situation} onReset={handleReset} />
        )}
      </main>
      <Navigation />
    </div>
  );
};

export default TarotMode;
