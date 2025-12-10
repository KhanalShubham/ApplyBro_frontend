export const FUNKY_MESSAGES = {
    loginSuccess: [
        "You’re in! The internet gates have spoken.",
        "Login vibes immaculate ✨",
        "Access granted, legend.",
        "Welcome back, digital warrior.",
        "Boom! You just teleported inside 🚀",
        "System: *hacker voice* I’m in.",
        "Identity confirmed. You are who you say you are.",
        "Welcome back. We missed your face.",
        "Loading greatness... Done.",
        "The matrix has accepted your credentials."
    ],
    loginFailure: [
        "Nope. Try again before the keyboard gets angry 😤",
        "Wrong creds… but we believe in you.",
        "Access denied. Your password said ‘not today’.",
        "Try again, hacker man wannabe.",
        "Hmm… that didn’t math.",
        "Computer says no.",
        "Close, but no cigar.",
        "Memory check: Did you change your password?",
        "Finger slipped? Give it another go.",
        "That password ain't it, chief."
    ],
    signupSuccess: [
        "Account created! Your villain arc begins now 😈",
        "Welcome aboard! Your era starts here.",
        "You’re officially one of us now 💫",
        "Signup successful — the universe approves.",
        "Account unlocked. Adventure mode activated.",
        "New challenger approaching! Account created.",
        "Level 1: Unlocked. Lets goooo.",
        "Your application for coolness has been approved.",
        "Welcome to the club. Snacks are virtual.",
        "It’s official. You exist in our database."
    ],
    signupFailure: [
        "Signup crashed harder than my GPA 📉",
        "Hold up—something broke, but not your spirit.",
        "Error: the internet tripped over itself 😵‍💫",
        "Signup failed. The form needs vibes checked.",
        "Try again… the servers weren’t ready for your greatness.",
        "Oof. The database rejected that one.",
        "Something went wrong. Blame the intern.",
        "Glitch in the simulation. Retry?",
        "That didn't work. Have you tried asking nicely?",
        "Technical difficulties. Please stand by."
    ]
};

export const getRandomMessage = (type: keyof typeof FUNKY_MESSAGES): string => {
    const messages = FUNKY_MESSAGES[type];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
};
