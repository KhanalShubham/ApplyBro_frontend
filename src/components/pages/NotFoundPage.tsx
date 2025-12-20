import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Search, Home, ArrowLeft, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-0 shadow-2xl">
                    <CardContent className="p-12 text-center">
                        {/* 404 Number */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="mb-6"
                        >
                            <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                404
                            </h1>
                        </motion.div>

                        {/* Icon */}
                        <motion.div
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6"
                        >
                            <HelpCircle className="w-10 h-10 text-blue-600" />
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-3xl font-bold text-gray-900 mb-4"
                        >
                            Page Not Found
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
                        >
                            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                        </motion.p>

                        {/* Search Suggestion */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-md mx-auto"
                        >
                            <div className="flex items-start gap-3 text-left">
                                <Search className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-1">Looking for something?</h3>
                                    <p className="text-sm text-blue-700">
                                        Try searching for scholarships, guidance, or visit our community page to explore more.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
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

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 pt-8 border-t border-gray-200"
                        >
                            <p className="text-sm text-gray-500 mb-3">Quick Links:</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Button
                                    onClick={() => navigate("/dashboard")}
                                    variant="link"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Dashboard
                                </Button>
                                <span className="text-gray-300">•</span>
                                <Button
                                    onClick={() => navigate("/scholarships")}
                                    variant="link"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Scholarships
                                </Button>
                                <span className="text-gray-300">•</span>
                                <Button
                                    onClick={() => navigate("/guidance")}
                                    variant="link"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Guidance
                                </Button>
                                <span className="text-gray-300">•</span>
                                <Button
                                    onClick={() => navigate("/community")}
                                    variant="link"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Community
                                </Button>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
