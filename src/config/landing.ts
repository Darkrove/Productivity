import { FeatureLdg, InfoLdg, TestimonialType } from "@/types";

export const infos: InfoLdg[] = [
  {
    title: "Organize Your Life",
    description:
      "Take control of your tasks and boost your productivity with our intuitive todo app. Create, manage, and complete your tasks with ease, all in one place.",
    image: "/illustrations/work-from-home.svg",
    list: [
      {
        title: "Simple & Intuitive",
        description: "Create and manage your tasks with a clean, user-friendly interface.",
        icon: "laptop",
      },
      {
        title: "Smart Organization",
        description: "Categorize and prioritize your tasks for better workflow management.",
        icon: "settings",
      },
      {
        title: "Cross-Platform",
        description: "Access your tasks from anywhere, on any device.",
        icon: "search",
      },
    ],
  },
  {
    title: "Stay Productive",
    description:
      "Never miss a deadline again. Our todo app helps you stay on top of your tasks with reminders, due dates, and progress tracking.",
    image: "/illustrations/work-from-home.jpg",
    list: [
      {
        title: "Task Reminders",
        description: "Set reminders and due dates to keep your tasks on track.",
        icon: "laptop",
      },
      {
        title: "Progress Tracking",
        description: "Monitor your productivity with visual progress indicators.",
        icon: "search",
      },
      {
        title: "Sync & Share",
        description: "Collaborate with others by sharing tasks and lists.",
        icon: "settings",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "Smart Task Management",
    description:
      "Create, organize, and prioritize your tasks with our intuitive interface. Set due dates, add notes, and categorize tasks for better organization.",
    link: "/",
    icon: "laptop",
  },
  {
    title: "Reminders & Notifications",
    description:
      "Never miss a deadline with customizable reminders and notifications. Stay on top of your tasks with timely alerts.",
    link: "/",
    icon: "bell",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your productivity with visual progress indicators. Track completed tasks and maintain your momentum.",
    link: "/",
    icon: "chart",
  },
  {
    title: "Cross-Platform Sync",
    description:
      "Access your tasks from anywhere. Seamlessly sync across all your devices for uninterrupted productivity.",
    link: "/",
    icon: "sync",
  },
  {
    title: "Team Collaboration",
    description:
      "Share tasks and lists with your team. Collaborate effectively with real-time updates and comments.",
    link: "/",
    icon: "usersRound",
  },
  {
    title: "Custom Categories",
    description:
      "Organize your tasks with custom categories and tags. Create a system that works best for your workflow.",
    link: "/",
    icon: "folder",
  },
];

export const testimonials: TestimonialType[] = [
  {
    name: "Sarah Johnson",
    job: "Project Manager",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    review:
      "This todo app has completely transformed how I manage my daily tasks. The intuitive interface and smart organization features help me stay on top of multiple projects effortlessly. It's become an essential tool in my productivity toolkit.",
  },
  {
    name: "Michael Chen",
    job: "Freelance Developer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    review:
      "As someone who juggles multiple client projects, this todo app has been a game-changer. The ability to categorize tasks and set reminders ensures I never miss a deadline. The cross-platform sync is particularly useful when switching between devices.",
  },
  {
    name: "Emily Rodriguez",
    job: "Student",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    review:
      "This app has helped me stay organized throughout my academic journey. I can easily track assignments, set study reminders, and manage my schedule. The progress tracking feature keeps me motivated to complete my tasks.",
  },
  {
    name: "David Wilson",
    job: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    review:
      "Running a business means managing countless tasks daily. This todo app has streamlined my workflow and helped me delegate tasks effectively. The sharing feature makes team collaboration seamless.",
  },
  {
    name: "Lisa Thompson",
    job: "Remote Worker",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    review:
      "Working remotely requires excellent time management. This todo app's clean interface and smart organization features help me maintain productivity and work-life balance. The reminders are a lifesaver!",
  },
  {
    name: "James Park",
    job: "Content Creator",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    review:
      "Managing content calendars and deadlines used to be stressful. This todo app's intuitive design and progress tracking features have made task management a breeze. It's now an integral part of my creative workflow.",
  },
  {
    name: "Maria Garcia",
    job: "Event Planner",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    review:
      "Planning events requires meticulous attention to detail. This todo app's categorization and reminder features help me stay on top of every aspect of event planning. The ability to share tasks with my team is invaluable.",
  }
];