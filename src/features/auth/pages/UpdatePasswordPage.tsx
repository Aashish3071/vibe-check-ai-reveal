import { UpdatePasswordForm } from "../components/UpdatePasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import Sparkles from "@/common/components/Sparkles";

export const UpdatePasswordPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md gradient-card border-white/50 dark:border-purple-900/30 shadow-lg relative overflow-hidden">
        <Sparkles count={5} />
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-dancing mb-1">
            Update Password
          </CardTitle>
          <CardDescription>
            Please enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};
