import React from "react";
import StreakDisplay from "../components/StreakDisplay";
import AchievementsDisplay from "../components/AchievementsDisplay";

const Achievements = () => {
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Personal Journey</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <StreakDisplay />
        </div>

        <div className="md:col-span-2">
          <AchievementsDisplay />
        </div>
      </div>
    </div>
  );
};

export default Achievements;
