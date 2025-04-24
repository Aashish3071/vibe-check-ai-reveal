import React from "react";
import { useAppMode } from "@/common/lib/appMode";
import DatingLayout from "@/layouts/DatingLayout";
import TherapistLayout from "@/layouts/TherapistLayout";

interface LayoutSwitcherProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({
  children,
  showNavigation = true,
}) => {
  const { mode } = useAppMode();

  return (
    <>
      <DatingLayout showNavigation={showNavigation}>
        {mode === "dating" ? children : null}
      </DatingLayout>

      <TherapistLayout showNavigation={showNavigation}>
        {mode === "therapist" ? children : null}
      </TherapistLayout>
    </>
  );
};

export default LayoutSwitcher;
