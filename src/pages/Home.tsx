import { useState, useEffect, useRef } from "react";
import SosButton from "@/components/SosButton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import {
  Shield,
  Heart,
  MapPin,
  Bell,
  Phone,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Smartphone,
  MessageSquare,
  ArrowRight,
  Info,
  Star,
  Award,
  Calendar,
  Globe,
  Lock,
  Fan,
} from "lucide-react";

const Home = () => {
  const [lastSosTime, setLastSosTime] = useState(null);
  const [showTips, setShowTips] = useState(true);
  const [activeTip, setActiveTip] = useState(0);
  const navigate = useNavigate();
  const [successStories, setSuccessStories] = useState([
    {
      name: "Priya",
      story:
        "The app alerted my family when I felt unsafe returning home late. Their quick response made me feel protected and cared for.",
    },
    {
      name: "Neha",
      story:
        "Quick SOS alert helped me when I was being followed in a market. My brother reached within minutes and confronted the stalker.",
    },
    {
      name: "Anjali",
      story:
        "My safety network received alerts when I used the panic button during an emergency. Now I move confidently knowing protection is just a tap away.",
    },
  ]);
  const [activeStory, setActiveStory] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { toast } = useToast();

  const safetyTips = [
    {
      icon: <MapPin className="text-purple-300" />,
      tip: "Stay in well-lit areas when walking at night and avoid shortcuts through isolated areas",
    },
    {
      icon: <Users className="text-purple-300" />,
      tip: "Share your live location with trusted friends when traveling alone or meeting someone new",
    },
    {
      icon: <Phone className="text-purple-300" />,
      tip: "Keep emergency contacts updated and consider setting up speed dial for quick access",
    },
    {
      icon: <AlertTriangle className="text-purple-300" />,
      tip: "Trust your instincts when uncomfortable — your intuition is a powerful safety tool",
    },
    {
      icon: <Lock className="text-purple-300" />,
      tip: "Always inform someone about your whereabouts when traveling to unfamiliar locations",
    },
  ];

  // Testimonials from community leaders
  const testimonials = [
    {
      name: "Dr. Meera Singh",
      role: "Women's Safety Advocate",
      quote:
        "RakshaMitr represents a crucial step forward in empowering women with technology-enabled safety solutions.",
    },
    {
      name: "Inspector Kavita Sharma",
      role: "Law Enforcement Officer",
      quote:
        "This app has already helped prevent numerous incidents and provided crucial evidence in cases of harassment.",
    },
    {
      name: "Sunita Devi",
      role: "Community Leader",
      quote:
        "For women in our community, having RakshaMitr means walking with confidence and knowing help is available instantly.",
    },
  ];

  // Simulate quick stats
  const stats = [
    { label: "Empowered Women", value: "50,000+" },
    { label: "Emergency Alerts", value: "1,240" },
    { label: "Safety Network", value: "120,000+" },
    { label: "Cities Covered", value: "28" },
  ];

  useEffect(() => {
    // Rotate through safety tips every 5 seconds
    const tipInterval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % safetyTips.length);
    }, 5000);

    // Rotate through success stories
    const storyInterval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % successStories.length);
    }, 6000);

    return () => {
      clearInterval(tipInterval);
      clearInterval(storyInterval);
    };
  }, []);

  const handleSosActivate = (location) => {
    // In real app, this would send API request to backend
    console.log("SOS activated at location:", location);
    setLastSosTime(new Date());

    // Simulated API call
    setTimeout(() => {
      toast({
        title: "SOS Alert Sent Successfully",
        description:
          "Your emergency contacts have been notified with your current location.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 overflow-x-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-950/30 to-gray-900 pointer-events-none"></div>

      {/* Mobile Navigation Overlay */}
      {isNavOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-900 z-40 p-6 flex flex-col gap-6"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex justify-end">
            <button onClick={() => setIsNavOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M6 6L18 18 M18 6L6 18"
                />
              </svg>
            </button>
          </div>

          {[
            "Home",
            "Emergency Contacts",
            "Safety Map",
            "My Profile",
            "Settings",
            "Self Defense Tips",
            "Report Incident",
          ].map((item, i) => (
            <motion.a
              key={i}
              href="#"
              className="flex items-center justify-between p-3 border-b border-purple-900/30 text-gray-300"
              whileHover={{ x: 5, color: "rgb(216, 180, 254)" }}
            >
              <span>{item}</span>
              <ChevronRight size={16} />
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />

        <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 text-transparent bg-clip-text mb-4">
              Empower Your Journey
            </h2>
            <p className="text-gray-300 mb-6 max-w-md mx-auto md:mx-0 text-lg">
              RakshaMitr sends instant alerts to your trusted contacts with your
              exact location, empowering you to move with confidence and
              security.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <motion.button
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-purple-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell size={16} />
                <span>Set Up Alerts</span>
              </motion.button>
              <motion.button
                className="flex items-center gap-2 border border-purple-500 text-purple-300 px-6 py-3 rounded-lg font-medium"
                whileHover={{ scale: 1.05, borderColor: "rgb(216, 180, 254)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log("Navigating to contacts page");
                  navigate("/contacts");
                }}
              >
                <Users size={16} />
                <span>Add Contacts</span>
              </motion.button>
            </div>

            <div className="mt-6 flex items-center justify-center md:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-gray-400 text-sm ml-2">
                Join 50,000+ women feeling safer
              </span>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/30 via-pink-600/20 to-purple-600/30 rounded-2xl blur-md"></div>
              <div className="relative bg-gray-800 border border-purple-500/30 rounded-2xl p-6 shadow-xl z-10 w-full max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-purple-400" />
                  <h3 className="font-bold text-purple-300">
                    Emergency Alert System
                  </h3>
                </div>
                <div className="p-4 bg-gray-900/80 rounded-lg mb-4 border border-purple-600/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">
                        Current Location
                      </div>
                      <div className="text-sm text-gray-200">
                        MG Road, Bengaluru
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-300">
                      Status: Secure
                    </span>
                    <span className="text-xs text-gray-400">
                      5 contacts added
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 py-2 rounded-md bg-purple-600/20 text-purple-300 text-sm font-medium">
                    Track Journey
                  </button>
                  <button className="flex-1 py-2 rounded-md bg-pink-600/20 text-pink-300 text-sm font-medium">
                    Alert Contacts
                  </button>
                </div>
                <div className="text-xs text-gray-400 text-center">
                  Your safety is our priority. Tap the SOS button in emergency.
                </div>
              </div>
              <motion.div
                className="absolute -bottom-4 -right-4 bg-gray-800 p-3 rounded-lg shadow-lg z-20 border border-green-500/30"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="text-green-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm shadow-md py-6 px-4 border-y border-purple-600/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                {stat.value}
              </span>
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main SOS Section */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/10">
        <motion.div
          className="text-center relative mb-16"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
        >
          {/* Pulsing circles */}
          <motion.div
            className="absolute -inset-10 rounded-full bg-purple-600/10 z-0"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute -inset-20 rounded-full bg-pink-600/5 z-0"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 0.5,
            }}
          />

          <div className="relative z-10">
            <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Emergency SOS
            </h3>
            <p className="mb-6 text-gray-300 max-w-md mx-auto">
              Press and hold for 3 seconds to send an emergency alert with your
              location to your contacts
            </p>
            <SosButton onActivate={handleSosActivate} />

            {lastSosTime && (
              <motion.p
                className="mt-4 text-sm text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                Last alert sent: {lastSosTime.toLocaleTimeString()}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          className="w-full max-w-5xl mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            How RakshaMitr Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="w-8 h-8 text-purple-400" />,
                title: "Press SOS Button",
                desc: "Activate emergency alert with a simple press and hold action when you feel unsafe",
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-purple-400" />,
                title: "Messages Are Sent",
                desc: "Your emergency contacts receive immediate text messages with your real-time location",
              },
              {
                icon: <MapPin className="w-8 h-8 text-purple-400" />,
                title: "Help Arrives",
                desc: "Your contacts can quickly locate and assist you through the precise tracking system",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl p-6 relative overflow-hidden border border-purple-600/30"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-600/10 rounded-bl-full" />
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-lg text-purple-200">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">{step.desc}</p>
                </div>

                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="text-purple-400 opacity-80" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          className="w-full max-w-5xl mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Endorsed By Leaders
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-purple-600/30"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <Award className="text-purple-400 mb-2" />
                    <p className="text-gray-300 italic">"{item.quote}"</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-purple-600/20">
                    <p className="font-semibold text-purple-300">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="w-full max-w-5xl mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Empowerment Features
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Bell className="w-6 h-6 text-purple-400" />,
                title: "Instant Alerts",
                desc: "One tap to alert your emergency contacts",
              },
              {
                icon: <MapPin className="w-6 h-6 text-purple-400" />,
                title: "Location Tracking",
                desc: "Automatically shares your precise location",
              },
              {
                icon: <Phone className="w-6 h-6 text-purple-400" />,
                title: "Emergency Calling",
                desc: "Quick access to emergency services",
              },
              {
                icon: <Heart className="w-6 h-6 text-purple-400" />,
                title: "Safety Network",
                desc: "Build your personal safety network",
              },
              {
                icon: <Clock className="w-6 h-6 text-purple-400" />,
                title: "Journey Tracking",
                desc: "Set timers for expected arrivals",
              },
              {
                icon: <AlertTriangle className="w-6 h-6 text-purple-400" />,
                title: "Danger Zones",
                desc: "Get alerts about unsafe areas",
              },
              {
                icon: <Shield className="w-6 h-6 text-purple-400" />,
                title: "Safe Routes",
                desc: "Find safest paths to destination",
              },
              {
                icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
                title: "Safety Chat",
                desc: "Connect with safety guardians",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl p-6 hover:shadow-lg transition-all duration-300 border border-purple-600/20"
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-purple-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-300">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Safety Features */}
        <motion.div
          className="w-full max-w-5xl mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-600/30 shadow-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Fan className="text-purple-400" />
                  <h3 className="text-xl font-semibold text-purple-300">
                    Self-Defense Tips
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Create distance between yourself and potential threats",
                    "Use everyday objects as defensive tools when necessary",
                    "Project confidence through posture and eye contact",
                    "Learn basic strike techniques for vital areas",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-purple-600/20 rounded-full">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-gray-300">{tip}</p>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-lg text-sm font-medium">
                  View All Self-Defense Tips
                </button>
              </div>
            </div>

            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-600/30 shadow-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="text-purple-400" />
                  <h3 className="text-xl font-semibold text-purple-300">
                    Upcoming Safety Workshops
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Street Safety Awareness",
                      date: "May 5",
                      location: "Community Center",
                    },
                    {
                      title: "Self-Defense Basics",
                      date: "May 12",
                      location: "City Park",
                    },
                    {
                      title: "Digital Safety & Privacy",
                      date: "May 19",
                      location: "Public Library",
                    },
                    {
                      title: "Situational Awareness",
                      date: "May 26",
                      location: "Youth Center",
                    },
                  ].map((event, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center pb-2 border-b border-purple-900/20"
                    >
                      <div>
                        <p className="font-medium text-purple-200">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {event.location}
                        </p>
                      </div>
                      <div className="bg-purple-600/20 px-3 py-1 rounded-full text-purple-300 text-xs">
                        {event.date}
                      </div>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-lg text-sm font-medium">
                  Register For Workshops
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          className="w-full max-w-5xl mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Success Stories
          </h3>

          <div className="relative bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl p-8 overflow-hidden border border-purple-600/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400/20 to-pink-400" />

            <motion.div
              key={activeStory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-300">
                  {successStories[activeStory].name.charAt(0)}
                </span>
              </div>
              <p className="text-gray-300 italic text-lg max-w-2xl">
                "{successStories[activeStory].story}"
              </p>
              <p className="font-medium text-lg bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                {successStories[activeStory].name}
              </p>
            </motion.div>

            <div className="flex justify-center mt-6 gap-2">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStory(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeStory
                      ? "bg-gradient-to-r from-purple-400 to-pink-400"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Safety Tips */}
        <motion.div
          className="w-full max-w-5xl mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Personal Safety Tips
            </h3>
            <motion.button
              onClick={() => setShowTips(!showTips)}
              className="text-sm text-purple-300 hover:text-purple-200 flex items-center gap-1 bg-purple-600/10 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showTips ? "Hide Tips" : "Show Tips"}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {showTips && (
            <motion.div
              className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-purple-600/30"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-6">
                <motion.div
                  key={activeTip}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg"
                >
                  <div className="p-3 bg-purple-600/20 rounded-full flex-shrink-0">
                    {safetyTips[activeTip].icon}
                  </div>
                  <p className="text-gray-200">{safetyTips[activeTip].tip}</p>
                </motion.div>

                <div className="flex justify-center mt-4 gap-2">
                  {safetyTips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTip(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === activeTip
                          ? "bg-gradient-to-r from-purple-400 to-pink-400"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-purple-600/10 p-4 border-t border-purple-900/20">
                <div className="flex items-center gap-2">
                  <Info className="text-purple-300 w-4 h-4" />
                  <p className="text-sm text-gray-300">
                    Tap the dots to navigate through safety tips or wait for
                    auto-rotation
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Community Engagement */}
        <motion.div
          className="w-full max-w-5xl mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Join Our Community
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Globe className="w-8 h-8 text-purple-400" />,
                title: "Safety Forums",
                desc: "Connect with other women to share experiences and safety tips in your area",
              },
              {
                icon: <Users className="w-8 h-8 text-purple-400" />,
                title: "Local Chapters",
                desc: "Join RakshaMitr community groups in your city for in-person safety workshops",
              },
              {
                icon: <Award className="w-8 h-8 text-purple-400" />,
                title: "Volunteer Program",
                desc: "Help expand our safety network and empower more women in your community",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30 shadow-xl"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg text-purple-200">
                    {item.title}
                  </h3>
                  <p className="text-gray-300">{item.desc}</p>
                  <button className="mt-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-full text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="w-full max-w-5xl mb-16 rounded-lg shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-purple-800/30 blur-sm"></div>
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
                  Set Up Your Safety Network Today
                </h3>
                <p className="text-gray-200 mb-6 text-lg">
                  Add emergency contacts, customize alerts, and gain peace of
                  mind knowing help is just a button press away.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-purple-500/20 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Users size={18} />
                    <span>Get Started Now</span>
                  </motion.button>
                  <motion.button
                    className="bg-transparent border border-purple-400 text-purple-300 font-medium px-6 py-3 rounded-lg flex items-center gap-2"
                    whileHover={{
                      scale: 1.05,
                      borderColor: "rgb(216, 180, 254)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Info size={18} />
                    <span>Learn More</span>
                  </motion.button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-lg"></div>
                  <div className="relative p-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                    <div className="bg-gray-900 p-1 rounded-full">
                      <img
                        src="/api/placeholder/180/180"
                        alt="Safety Network"
                        className="rounded-full relative z-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div>
      {/* Your page content here */}
      <Footer />
    </div>
    </div>
  );
};
export default Home;
