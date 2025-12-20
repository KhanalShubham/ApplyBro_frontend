import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Shield, Home, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-0 shadow-2xl">
                    <CardContent className="p-12 text-center">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6"
                        >
                            <Shield className="w-12 h-12 text-red-600" />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold text-gray-900 mb-4"
                        >
                            Access Denied
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
                        >
                            You don't have permission to access this page. This area is restricted to authorized users only.
                        </motion.p>

                        {/* Error Code */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-mono font-semibold mb-8"
                        >
                            Error 403 - Forbidden
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button
                                onClick={() => navigate(-1)}
                                variant="outline"
                                size="lg"
                                className="gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Go Back
                            </Button>
                            <Button
                                onClick={() => navigate("/")}
                                size="lg"
                                className="gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                                <Home className="w-4 h-4" />
                                Go to Homepage
                            </Button>
                        </motion.div>

                        {/* Additional Help */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-8 pt-8 border-t border-gray-200"
                        >
                            <p className="text-sm text-gray-500">
                                If you believe this is an error, please contact{" "}
                                <a
                                    href="mailto:support@applybro.com"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    support@applybro.com
                                </a>
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
