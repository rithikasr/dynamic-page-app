
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { API_ENDPOINTS } from "@/constants/apiConstants";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Step = "REQUEST" | "VERIFY" | "RESET" | "SUCCESS";

export default function ForgotPassword() {
    const [step, setStep] = useState<Step>("REQUEST");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setStep("VERIFY");
                toast({
                    title: "OTP Sent",
                    description: "Please check your email for the verification code.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Failed to send OTP",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.AUTH.VERIFY_OTP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();

            if (res.ok) {
                setStep("RESET");
                toast({
                    title: "Verified",
                    description: "OTP verified successfully. Please set a new password.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Verification Failed",
                    description: data.message || "Invalid OTP",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                setStep("SUCCESS");
                toast({
                    title: "Password Reset",
                    description: "Your password has been reset successfully.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Failed to reset password",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        {step !== "REQUEST" && step !== "SUCCESS" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 -ml-2"
                                onClick={() => setStep(step === "RESET" ? "VERIFY" : "REQUEST")}
                                type="button"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <CardTitle className="text-2xl font-bold">
                            {step === "REQUEST" && "Forgot Password"}
                            {step === "VERIFY" && "Verify OTP"}
                            {step === "RESET" && "Reset Password"}
                            {step === "SUCCESS" && "Success!"}
                        </CardTitle>
                    </div>
                    <CardDescription>
                        {step === "REQUEST" && "Enter your email specifically to receive a verification code."}
                        {step === "VERIFY" && `Enter the OTP sent specifically to ${email}`}
                        {step === "RESET" && "Create a strong new password for your account."}
                        {step === "SUCCESS" && "Your password has been successfully reset."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "REQUEST" && (
                        <form onSubmit={handleRequestOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button className="w-full bg-pink-600 hover:bg-pink-700" type="submit" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send OTP"}
                            </Button>
                        </form>
                    )}

                    {step === "VERIFY" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                                <Input
                                    id="otp"
                                    placeholder="Enter 6-digit code"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="tracking-widest text-center text-lg"
                                />
                            </div>
                            <Button className="w-full bg-pink-600 hover:bg-pink-700" type="submit" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Code"}
                            </Button>
                        </form>
                    )}

                    {step === "RESET" && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    placeholder="Enter new password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <Button className="w-full bg-pink-600 hover:bg-pink-700" type="submit" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                            </Button>
                        </form>
                    )}

                    {step === "SUCCESS" && (
                        <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <p className="text-center text-gray-600">
                                You can now log in with your new password.
                            </p>
                            <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={() => navigate("/login")}>
                                Go to Login
                            </Button>
                        </div>
                    )}
                </CardContent>
                {step === "REQUEST" && (
                    <CardFooter className="justify-center">
                        <Link to="/login" className="text-sm text-pink-600 hover:underline">
                            Back to Login
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
