import { Button } from "./ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";

type SuccessState = {
  userData?: {
    fullName?: string;
  };
};

export function SuccessScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = (location.state as SuccessState) || {};
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!userData) {
      navigate("/", { replace: true });
      return;
    }

    setShowConfetti(true);
    
    // Create confetti effect
    const colors = ['#007BFF', '#4CAF50', '#FFD700', '#FF6B6B', '#9C27B0'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
      }, i * 30);
    }
  }, []);

  const createConfetti = (color: string) => {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    
    document.body.appendChild(confetti);

    const animation = confetti.animate([
      { 
        transform: `translateY(0px) rotate(0deg)`,
        opacity: 1
      },
      { 
        transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 720}deg)`,
        opacity: 0
      }
    ], {
      duration: 3000 + Math.random() * 2000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => {
      confetti.remove();
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          Welcome to ApplyBro, {userData?.fullName?.split(' ')[0] || 'Student'}! 🎉
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Your account has been successfully created. We're excited to help you discover amazing scholarship opportunities tailored just for you!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-3 text-left">
            <Sparkles className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">What's Next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Verify your email address to activate your account</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Upload your documents for verification (after email confirmation)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Browse thousands of verified scholarships</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Get personalized scholarship recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            size="lg"
            style={{ backgroundColor: '#007BFF' }}
            onClick={() => window.location.reload()}
          >
            Explore Scholarships
          </Button>
          <Button size="lg" variant="outline">
            Complete Your Profile
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500 mt-8"
        >
          Need help? Check out our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Getting Started Guide
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
