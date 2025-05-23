
import { Link } from "react-router-dom";
import { User, Users, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";

const DashboardOptions = () => {
  const { theme } = useTheme();

  const options = [
    {
      title: "Student Expenses",
      description: "Track and manage your student expenses efficiently",
      icon: User,
      to: "/student-expenses",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Family Expenses",
      description: "Manage household expenses and budget together",
      icon: Users,
      to: "/family-expenses",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Expense History & Predictions",
      description: "View past expenses and future predictions",
      icon: Calendar,
      to: "/analytics",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      {options.map((option) => (
        <Link key={option.title} to={option.to} className="group">
          <Card className={`
            h-full p-6 transition-all duration-300
            hover:scale-105 cursor-pointer
            ${theme === 'dark' ? 'bg-opacity-10' : 'bg-opacity-90'}
            backdrop-blur-sm border border-opacity-30
            bg-gradient-to-br ${option.gradient}
          `}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`
                p-4 rounded-full 
                ${theme === 'dark' ? 'bg-white/10' : 'bg-white/90'}
                group-hover:scale-110 transition-transform duration-300
              `}>
                <option.icon className={`
                  w-8 h-8
                  ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
                `} />
              </div>
              <h3 className={`
                text-xl font-semibold
                ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
              `}>
                {option.title}
              </h3>
              <p className={`
                text-sm
                ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}
              `}>
                {option.description}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default DashboardOptions;
