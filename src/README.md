# ApplyBro - Scholarship Platform

A comprehensive, modern scholarship discovery and application platform designed for students worldwide. Built with React, TypeScript, Tailwind CSS, and Motion animations.

## 🌟 Features

### Public Pages
- **Landing Page**: Modern hero section, featured scholarships, how-it-works guide, testimonials, and community highlights
- **Login Page**: Secure authentication with form validation
- **Sign-Up Flow**: Multi-step registration process (4 steps) with document uploads and profile completion

### Student Dashboard (8 Complete Pages)

#### 1. 🏠 Dashboard Home
- Personalized welcome with profile completion tracker
- Achievement badges system
- Recommended scholarships carousel
- Document verification status cards
- Guidance resources with progress tracking
- Community highlights feed
- Quick stats and AI-powered tips
- Mini calendar with upcoming deadlines
- Floating AI assistant bot

#### 2. 🎓 Scholarships Page
- Advanced search and filtering (country, degree, field, GPA)
- Grid/List view toggle
- Tabs: All Scholarships, Recommended, Bookmarked
- Sorting by deadline or name
- Interactive scholarship cards with bookmark functionality
- Detailed scholarship information
- Empty state handling

#### 3. 📁 My Documents Page
- Document upload with drag-and-drop support
- Real-time upload progress tracking
- Document verification timeline
- Status badges (Verified, Pending, Rejected)
- Document preview thumbnails
- View, download, and delete actions
- Upload guidelines sidebar with format and size requirements

#### 4. 🔖 Saved Items Page
- Tabbed interface: Scholarships, Guidance, Videos, Posts
- Search within saved items
- Grid layout with hover animations
- Quick remove functionality
- Thumbnail previews
- Metadata display (deadlines, authors, durations)

#### 5. 📚 Guidance Page
- Four content types: Articles, Videos, FAQs, Practice Tests
- Topic filtering (IELTS, DAAD, SOP, Motivation Letter)
- Progress tracking for learning resources
- Difficulty levels (Beginner, Intermediate, Advanced)
- Bookmark and share functionality
- "Recommended for You" sidebar based on profile
- Reading/watching progress indicators

#### 6. 💬 Community Page
- Create and view student posts
- Post status system (Approved, Pending, Declined)
- Like and comment functionality
- Top liked posts sidebar
- Community guidelines card
- Moderation-friendly interface
- Report functionality
- Real-time post updates

#### 7. 🗓️ Calendar Page
- Monthly calendar view with deadline markers
- List view with advanced filtering
- Deadline urgency indicators (Urgent, Soon, Normal)
- Quick stats dashboard
- Add reminders with notification preferences
- Export to Google/Apple/Outlook calendars
- This week's deadlines widget
- Color-coded deadline badges

#### 8. ⚙️ Settings Page
Five settings sections:
- **Profile Settings**: Edit name, email, phone, country, profile picture
- **Language**: English (Nepali coming soon)
- **Notifications**: Email and push notification preferences for scholarships, posts, and reminders
- **Security**: Change password with validation
- **Delete Account**: Account deletion with confirmation and reason selection

## 🎨 Design System

### Colors
- Primary: #007BFF (Blue)
- Background: #E9F2FF → #FFFFFF (Gradient)
- Text: #1E293B
- Success: Green-600
- Warning: Orange-600
- Error: Red-600

### Typography
- Font Family: Poppins / Inter (system default)
- Responsive font sizes managed through globals.css
- No inline Tailwind font classes to preserve typography system

### UI Components (ShadCN)
All components from `/components/ui`:
- Forms: Input, Textarea, Select, Switch, Checkbox, Radio
- Navigation: Tabs, Breadcrumb, Navigation Menu
- Feedback: Alert, Toast (Sonner), Progress, Badge
- Overlays: Dialog, Alert Dialog, Drawer, Popover, Tooltip
- Layout: Card, Separator, Scroll Area, Resizable
- Data Display: Table, Avatar, Calendar, Skeleton
- And more...

### Animations
- Motion/React for page transitions
- Scroll-triggered animations
- Hover effects and micro-interactions
- Loading states and progress indicators

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4.0
- **Animations**: Motion (formerly Framer Motion)
- **UI Components**: ShadCN UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner
- **Images**: Unsplash API integration

## 📁 Project Structure

```
/
├── components/
│   ├── pages/
│   │   ├── ScholarshipsPage.tsx      # Scholarship search & filter
│   │   ├── DocumentsPage.tsx         # Document management
│   │   ├── SavedItemsPage.tsx        # Bookmarked items
│   │   ├── GuidancePage.tsx          # Learning resources
│   │   ├── CommunityPage.tsx         # Student community
│   │   ├── CalendarPage.tsx          # Deadline calendar
│   │   └── SettingsPage.tsx          # Account settings
│   ├── ui/                           # ShadCN components
│   ├── figma/
│   │   └── ImageWithFallback.tsx     # Image component
│   ├── Dashboard.tsx                 # Main dashboard shell
│   ├── LandingPage.tsx              # Public landing page
│   ├── LoginPage.tsx                # Authentication
│   ├── StepOne.tsx                  # Signup step 1
│   ├── StepTwo.tsx                  # Signup step 2
│   ├── StepThree.tsx                # Signup step 3
│   ├── StepFour.tsx                 # Signup step 4
│   └── SuccessScreen.tsx            # Post-signup success
├── styles/
│   └── globals.css                  # Global styles & tokens
├── App.tsx                          # Main app router
└── README.md                        # This file
```

## 🎯 User Flows

### New User Journey
1. **Landing Page** → Learn about ApplyBro
2. **Sign Up** → 4-step registration process
   - Step 1: Basic account info (email, password)
   - Step 2: Document uploads (transcripts, certificates)
   - Step 3: Academic qualifications (GPA, education level)
   - Step 4: Preferences & confirmation
3. **Success Screen** → Confetti celebration
4. **Dashboard** → Access full platform

### Returning User Journey
1. **Landing Page** → Click "Login"
2. **Login Page** → Enter credentials
3. **Dashboard** → Access personalized content

## 🔑 Key Features

### Personalization
- AI-powered scholarship recommendations based on GPA and documents
- Customized guidance resources
- Progress tracking across all learning materials

### Interactivity
- Real-time search and filtering
- Drag-and-drop file uploads
- Like, comment, and bookmark functionality
- Calendar integration and reminders

### Responsive Design
- Desktop-first with mobile adaptation
- Collapsible sidebar navigation
- Responsive grid layouts
- Touch-friendly interactions

### Data Management
- Form validation throughout
- Local state management
- Toast notifications for user feedback
- Empty state handling

## 🎨 Design Highlights

- **Glassmorphism**: Frosted glass effects on navigation and cards
- **Gradients**: Subtle blue-to-white backgrounds
- **Rounded Corners**: Consistent 16px radius
- **Soft Shadows**: Material Design 3 elevation system
- **Smooth Transitions**: 300ms duration for state changes
- **Color-Coded Status**: Visual feedback through badge colors

## 🌐 External Integrations

### Current
- Unsplash API for stock images
- DiceBear API for avatars

### Planned (Requires Backend)
- Supabase for authentication and database
- File storage for document uploads
- Real-time notifications
- Email services
- Calendar sync (Google, Apple, Outlook)

## 📝 Notes

### Backend Requirements
The application is currently frontend-only. For full functionality, integrate:
- User authentication system
- Database for scholarships, documents, posts
- File storage service
- Email notification service
- API for scholarship data

### Mock Data
All data is currently hardcoded for demonstration. Replace with API calls when backend is ready.

### Environment Variables
None currently required. Add when integrating external services:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_UNSPLASH_ACCESS_KEY=
```

## 🚧 Future Enhancements

- [ ] Backend integration with Supabase
- [ ] Real-time notifications
- [ ] Email verification
- [ ] Social authentication (Google, Facebook)
- [ ] Multi-language support (Nepali, Hindi, etc.)
- [ ] Advanced AI matching algorithms
- [ ] Scholarship application tracking
- [ ] Interview preparation tools
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for moderation

## 📄 License

This project is private and proprietary.

## 👥 Credits

Designed and developed for ApplyBro - Empowering Students Across Nepal

---

**© 2025 ApplyBro | Empowering Students with Opportunities**
