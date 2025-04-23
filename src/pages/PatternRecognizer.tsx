import React, { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRightCircle,
  Repeat,
  Brain,
  Lightbulb,
  Sparkles as SparklesIcon,
} from "lucide-react";
import Sparkles from "@/components/Sparkles";
import { toast } from "sonner";

const PatternTimeline = ({ patterns }: { patterns: any[] }) => (
  <div className="relative pl-6 mt-4 space-y-6">
    {/* Timeline line */}
    <div className="absolute top-0 left-3 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-pink-400"></div>

    {patterns.map((pattern, index) => (
      <div key={index} className="relative">
        {/* Timeline dot */}
        <div className="absolute -left-6 mt-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <span className="text-white text-xs">{index + 1}</span>
        </div>

        <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <span className="text-xl">{pattern.emoji}</span> {pattern.title}
            </CardTitle>
            <CardDescription>{pattern.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">{pattern.description}</p>
            <div className="flex justify-between items-center gap-2 mt-4">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Impact on you:
                </p>
                <Progress value={pattern.impact} className="h-2" />
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/40 py-1 px-3 rounded-full text-xs">
                {pattern.frequency}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ))}
  </div>
);

const PatternInsight = ({ insight }: { insight: any }) => (
  <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg mb-4 overflow-hidden relative">
    <Sparkles count={3} />
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <CardTitle className="text-lg">{insight.title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm mb-3">{insight.description}</p>

      <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-lg mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-4 h-4 text-pink-500" />
          <p className="text-sm font-medium">Why This Happens:</p>
        </div>
        <p className="text-xs">{insight.why}</p>
      </div>

      <div className="bg-pink-100 dark:bg-pink-900/40 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <SparklesIcon className="w-4 h-4 text-purple-500" />
          <p className="text-sm font-medium">Break The Cycle:</p>
        </div>
        <p className="text-xs">{insight.solution}</p>
      </div>
    </CardContent>
  </Card>
);

const PatternQuiz = ({ onComplete }: { onComplete: (result: any) => void }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: "q1",
      question:
        "How often do you find yourself attracted to the same type of person?",
      options: [
        { value: "rarely", label: "Rarely - I like variety" },
        {
          value: "sometimes",
          label: "Sometimes - I have a type but I'm flexible",
        },
        { value: "often", label: "Often - I definitely have a specific type" },
        {
          value: "always",
          label: "Always - It's almost like I'm dating the same person",
        },
      ],
    },
    {
      id: "q2",
      question:
        "When dating someone new, how often do past relationship issues resurface?",
      options: [
        { value: "rarely", label: "Rarely - Each relationship feels fresh" },
        { value: "sometimes", label: "Sometimes - Occasional déjà vu moments" },
        { value: "often", label: "Often - I notice similar problems" },
        {
          value: "always",
          label: "Always - It's like watching the same movie",
        },
      ],
    },
    {
      id: "q3",
      question:
        "How do you typically respond when someone shows strong interest in you?",
      options: [
        { value: "excited", label: "I get excited and lean in" },
        { value: "cautious", label: "I'm cautiously optimistic" },
        { value: "suspicious", label: "I get suspicious or doubtful" },
        { value: "retreat", label: "I tend to pull back or lose interest" },
      ],
    },
    {
      id: "q4",
      question: "What tends to end your relationships most often?",
      options: [
        { value: "communication", label: "Communication problems" },
        { value: "trust", label: "Trust issues" },
        { value: "boredom", label: "Boredom or feeling trapped" },
        { value: "emotional", label: "Emotional unavailability" },
      ],
    },
    {
      id: "q5",
      question: "How long do your relationships typically last?",
      options: [
        { value: "veryShort", label: "Very short - Weeks or a few months" },
        { value: "short", label: "Short - 3-6 months" },
        { value: "medium", label: "Medium - 6 months to a year" },
        { value: "long", label: "Long - Over a year" },
      ],
    },
  ];

  const handleNextStep = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      // Quiz complete - analyze results
      let pattern = "";
      let description = "";

      if (
        answers.q1 === "always" &&
        (answers.q3 === "suspicious" || answers.q3 === "retreat")
      ) {
        pattern = "Unavailable Attraction Pattern";
        description =
          "You're consistently drawn to emotionally unavailable people.";
      } else if (answers.q4 === "trust" && answers.q2 === "often") {
        pattern = "Trust Sabotage Loop";
        description =
          "Past trust issues keep affecting your new relationships.";
      } else if (answers.q3 === "retreat" && answers.q5 === "veryShort") {
        pattern = "Fear of Commitment Cycle";
        description = "You tend to pull away when things get serious.";
      } else if (answers.q4 === "communication" && answers.q2 === "often") {
        pattern = "Communication Breakdown Pattern";
        description = "You struggle with expressing needs in relationships.";
      } else {
        pattern = "Mixed Pattern";
        description =
          "You have some recurring themes but not one dominant pattern.";
      }

      onComplete({
        pattern,
        description,
        impact: Math.floor(Math.random() * 30) + 70, // 70-100
      });
    }
  };

  const currentQuestion = questions[step - 1];

  return (
    <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg overflow-hidden relative">
      <Sparkles count={3} />
      <CardHeader>
        <CardTitle className="text-lg">Relationship Pattern Quiz</CardTitle>
        <CardDescription>
          Step {step} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 font-medium">{currentQuestion.question}</p>

        <RadioGroup
          value={answers[currentQuestion.id]}
          onValueChange={(value) =>
            setAnswers({ ...answers, [currentQuestion.id]: value })
          }
          className="space-y-3"
        >
          {currentQuestion.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handleNextStep}
          className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
          disabled={!answers[currentQuestion.id]}
        >
          {step === questions.length ? "Complete Quiz" : "Next Question"}
          <ArrowRightCircle className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const PatternRecognizer = () => {
  const [activeTab, setActiveTab] = useState("quiz");
  const [patternResult, setPatternResult] = useState<any>(null);

  // Sample patterns data - in a real app this would come from a database
  const samplePatterns = [
    {
      emoji: "💔",
      title: "The Ghost Chaser",
      date: "Identified June 2023",
      description:
        "You're attracted to people who are emotionally unavailable and then feel hurt when they inevitably pull away.",
      impact: 85,
      frequency: "Very Common",
    },
    {
      emoji: "🔁",
      title: "Text Anxiety Loop",
      date: "Identified April 2023",
      description:
        "You overthink text responses, leading to anxiety spirals and miscommunication.",
      impact: 65,
      frequency: "Frequent",
    },
    {
      emoji: "🧊",
      title: "Hot & Cold Cycle",
      date: "Identified January 2023",
      description:
        "You pull away when someone shows too much interest, but chase them when they withdraw.",
      impact: 90,
      frequency: "Very Common",
    },
  ];

  const patternInsight = {
    title: patternResult
      ? patternResult.pattern
      : "Unavailable Attraction Pattern",
    description: patternResult
      ? patternResult.description
      : "You consistently find yourself drawn to partners who are emotionally unavailable. The chemistry feels intense at first, but they never fully commit.",
    why: "This often stems from early attachment patterns. The unpredictable nature of these connections triggers the reward centers in your brain, creating an addiction-like attraction to the emotional rollercoaster.",
    solution:
      'Start recognizing the early signs of emotional unavailability. Practice sitting with the discomfort of walking away from intense chemistry when red flags appear. Consider what "safety" means in a relationship and how it might actually feel unfamiliar to you.',
  };

  const handleQuizComplete = (result: any) => {
    setPatternResult(result);
    setActiveTab("result");
    toast.success("Pattern identified! ✨", {
      description: "Check out your relationship insights",
    });
  };

  return (
    <div className="min-h-screen pb-20 pt-16 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
      <Header />
      <main className="container mx-auto px-4 max-w-md">
        <h2 className="text-2xl font-dancing text-center mb-2">
          Am I In a Loop? 🔁
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Identify your relationship patterns
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="result">Insights</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="quiz">
            <PatternQuiz onComplete={handleQuizComplete} />
          </TabsContent>

          <TabsContent value="result">
            {patternResult ? (
              <div className="space-y-4">
                <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg overflow-hidden relative text-center">
                  <Sparkles count={5} />
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                      <Repeat className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {patternResult.pattern}
                    </h3>
                    <p className="text-sm mb-4">{patternResult.description}</p>

                    <div className="space-y-1 text-left mb-4">
                      <p className="text-xs font-medium">Pattern Strength:</p>
                      <Progress value={patternResult.impact} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtle</span>
                        <span>Strong</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <PatternInsight insight={patternInsight} />
              </div>
            ) : (
              <Card className="text-center p-6">
                <p>Please complete the quiz first to see your insights</p>
                <Button
                  onClick={() => setActiveTab("quiz")}
                  variant="secondary"
                  className="mt-4"
                >
                  Take the Quiz
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="gradient-card border-white/50 dark:border-purple-900/30 shadow-lg overflow-hidden relative mb-4">
              <Sparkles count={3} />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Pattern Timeline</CardTitle>
                <CardDescription>
                  Relationship patterns identified over time
                </CardDescription>
              </CardHeader>
            </Card>

            <PatternTimeline patterns={samplePatterns} />
          </TabsContent>
        </Tabs>
      </main>
      <Navigation />
    </div>
  );
};

export default PatternRecognizer;
