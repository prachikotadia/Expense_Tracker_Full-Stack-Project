
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useExpenses } from "@/context/ExpenseContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowRight, School } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentExpenseFormProps {
  onComplete: () => void;
}

interface University {
  name: string;
  id: string;
}

interface StateUniversities {
  [state: string]: University[];
}

// University data organized by country and state
const universitiesByCountryAndState: Record<string, StateUniversities> = {
  "United States": {
    "California": [
      { name: "University of California, Berkeley", id: "ucb" },
      { name: "Stanford University", id: "stanford" },
      { name: "California Institute of Technology", id: "caltech" },
      { name: "University of California, Los Angeles", id: "ucla" },
      { name: "University of Southern California", id: "usc" },
      { name: "San Diego State University", id: "sdsu" },
      { name: "UC San Diego", id: "ucsd" },
      { name: "UC Davis", id: "ucdavis" }
    ],
    "Illinois": [
      { name: "University of Chicago", id: "uchicago" },
      { name: "Northwestern University", id: "northwestern" },
      { name: "Illinois Institute of Technology", id: "iit" },
      { name: "University of Illinois Chicago", id: "uic" },
      { name: "DePaul University", id: "depaul" },
      { name: "Loyola University Chicago", id: "loyola" },
      { name: "Illinois State University", id: "ilstu" },
      { name: "University of Illinois Urbana-Champaign", id: "uiuc" }
    ],
    "New York": [
      { name: "Columbia University", id: "columbia" },
      { name: "New York University", id: "nyu" },
      { name: "Cornell University", id: "cornell" },
      { name: "Syracuse University", id: "syracuse" },
      { name: "Fordham University", id: "fordham" },
      { name: "Rochester Institute of Technology", id: "rit" },
      { name: "SUNY Buffalo", id: "buffalo" },
      { name: "Rensselaer Polytechnic Institute", id: "rpi" }
    ],
    "Texas": [
      { name: "University of Texas at Austin", id: "utaustin" },
      { name: "Texas A&M University", id: "tamu" },
      { name: "Rice University", id: "rice" },
      { name: "University of Houston", id: "uh" },
      { name: "Southern Methodist University", id: "smu" },
      { name: "Baylor University", id: "baylor" },
      { name: "Texas Tech University", id: "ttu" },
      { name: "University of North Texas", id: "unt" }
    ],
    "Massachusetts": [
      { name: "Harvard University", id: "harvard" },
      { name: "Massachusetts Institute of Technology", id: "mit" },
      { name: "Boston University", id: "bu" },
      { name: "Northeastern University", id: "northeastern" },
      { name: "Tufts University", id: "tufts" },
      { name: "Boston College", id: "bc" },
      { name: "UMass Amherst", id: "umass" },
      { name: "Brandeis University", id: "brandeis" }
    ],
    "Florida": [
      { name: "University of Florida", id: "uf" },
      { name: "Florida State University", id: "fsu" },
      { name: "University of Miami", id: "miami" },
      { name: "University of Central Florida", id: "ucf" },
      { name: "Florida International University", id: "fiu" },
      { name: "University of South Florida", id: "usf" },
      { name: "Florida Atlantic University", id: "fau" },
      { name: "University of North Florida", id: "unf" }
    ],
    "Washington": [
      { name: "University of Washington", id: "uw" },
      { name: "Washington State University", id: "wsu" },
      { name: "Seattle University", id: "seattleu" },
      { name: "Gonzaga University", id: "gonzaga" },
      { name: "Western Washington University", id: "wwu" },
      { name: "Eastern Washington University", id: "ewu" },
      { name: "Pacific Lutheran University", id: "plu" },
      { name: "University of Puget Sound", id: "ups" }
    ],
    "Michigan": [
      { name: "University of Michigan", id: "umich" },
      { name: "Michigan State University", id: "msu" },
      { name: "Wayne State University", id: "wayne" },
      { name: "Western Michigan University", id: "wmu" },
      { name: "Central Michigan University", id: "cmu" },
      { name: "Michigan Technological University", id: "mtu" },
      { name: "Grand Valley State University", id: "gvsu" },
      { name: "Eastern Michigan University", id: "emu" }
    ],
    "Pennsylvania": [
      { name: "University of Pennsylvania", id: "upenn" },
      { name: "Penn State University", id: "psu" },
      { name: "Carnegie Mellon University", id: "cmu" },
      { name: "Temple University", id: "temple" },
      { name: "Drexel University", id: "drexel" },
      { name: "University of Pittsburgh", id: "pitt" },
      { name: "Lehigh University", id: "lehigh" },
      { name: "Villanova University", id: "villanova" }
    ],
    "Ohio": [
      { name: "Ohio State University", id: "osu" },
      { name: "Case Western Reserve University", id: "cwru" },
      { name: "University of Cincinnati", id: "uc" },
      { name: "Miami University", id: "miamioh" },
      { name: "Kent State University", id: "kent" },
      { name: "Bowling Green State University", id: "bgsu" },
      { name: "University of Dayton", id: "dayton" },
      { name: "Ohio University", id: "ohio" }
    ]
  },
  "India": {
    "Gujarat": [
      { name: "Indian Institute of Technology Gandhinagar", id: "iitgn" },
      { name: "Gujarat University", id: "gu" },
      { name: "Nirma University", id: "nirma" },
      { name: "Ahmedabad University", id: "au" },
      { name: "DAIICT", id: "daiict" },
      { name: "Gujarat Technological University", id: "gtu" },
      { name: "MS University Baroda", id: "msu" },
      { name: "Pandit Deendayal Energy University", id: "pdeu" }
    ],
    "Maharashtra": [
      { name: "Indian Institute of Technology Bombay", id: "iitb" },
      { name: "University of Mumbai", id: "mu" },
      { name: "Savitribai Phule Pune University", id: "sppu" },
      { name: "VJTI Mumbai", id: "vjti" },
      { name: "COEP Pune", id: "coep" },
      { name: "Symbiosis International University", id: "siu" },
      { name: "NMIMS University", id: "nmims" },
      { name: "ICT Mumbai", id: "ict" }
    ],
    "Karnataka": [
      { name: "Indian Institute of Science", id: "iisc" },
      { name: "National Institute of Technology Karnataka", id: "nitk" },
      { name: "Bangalore University", id: "bu" },
      { name: "Manipal Academy of Higher Education", id: "mahe" },
      { name: "PES University", id: "pes" },
      { name: "RV College of Engineering", id: "rvce" },
      { name: "BMS College of Engineering", id: "bmsce" },
      { name: "Christ University", id: "christ" }
    ],
    "Tamil Nadu": [
      { name: "Indian Institute of Technology Madras", id: "iitm" },
      { name: "Anna University", id: "au" },
      { name: "SSN College of Engineering", id: "ssn" },
      { name: "VIT University", id: "vit" },
      { name: "NIT Trichy", id: "nitt" },
      { name: "PSG College of Technology", id: "psg" },
      { name: "Madras Christian College", id: "mcc" },
      { name: "SRM Institute of Science and Technology", id: "srm" }
    ],
    "Delhi": [
      { name: "Indian Institute of Technology Delhi", id: "iitd" },
      { name: "Delhi University", id: "du" },
      { name: "Jawaharlal Nehru University", id: "jnu" },
      { name: "Delhi Technological University", id: "dtu" },
      { name: "Jamia Millia Islamia", id: "jmi" },
      { name: "NSIT Delhi", id: "nsit" },
      { name: "Indraprastha Institute of Information Technology", id: "iiit" },
      { name: "Amity University", id: "amity" }
    ],
    "West Bengal": [
      { name: "Indian Institute of Technology Kharagpur", id: "iitkgp" },
      { name: "Jadavpur University", id: "ju" },
      { name: "Calcutta University", id: "cu" },
      { name: "NIT Durgapur", id: "nitd" },
      { name: "St. Xavier's College", id: "sxc" },
      { name: "IIEST Shibpur", id: "iiest" },
      { name: "Presidency University", id: "presidency" },
      { name: "MAKAUT", id: "makaut" }
    ]
  },
  "United Kingdom": {
    "London": [
      { name: "Imperial College London", id: "imperial" },
      { name: "University College London", id: "ucl" },
      { name: "King's College London", id: "kcl" },
      { name: "London School of Economics", id: "lse" },
      { name: "Queen Mary University of London", id: "qmul" },
      { name: "City, University of London", id: "city" },
      { name: "Brunel University London", id: "brunel" },
      { name: "University of Westminster", id: "westminster" }
    ]
  },
  "Canada": {
    "Ontario": [
      { name: "University of Toronto", id: "uoft" },
      { name: "University of Waterloo", id: "waterloo" },
      { name: "McMaster University", id: "mcmaster" },
      { name: "Western University", id: "western" },
      { name: "Queen's University", id: "queens" },
      { name: "York University", id: "york" },
      { name: "University of Ottawa", id: "ottawa" },
      { name: "Ryerson University", id: "ryerson" }
    ]
  },
  "Australia": {
    "New South Wales": [
      { name: "University of Sydney", id: "sydney" },
      { name: "University of New South Wales", id: "unsw" },
      { name: "University of Technology Sydney", id: "uts" },
      { name: "Macquarie University", id: "mq" },
      { name: "Western Sydney University", id: "wsu" },
      { name: "University of Newcastle", id: "newcastle" },
      { name: "University of Wollongong", id: "uow" },
      { name: "Charles Sturt University", id: "csu" }
    ]
  }
};

const categories = [
  "Tuition",
  "Books & Supplies",
  "Housing",
  "Food",
  "Transportation",
  "Entertainment",
  "Personal Care",
  "Technology",
  "Health Insurance",
  "Miscellaneous"
];

const studyLevels = [
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
  "Certificate",
  "Diploma"
];

const StudentExpenseForm = ({ onComplete }: StudentExpenseFormProps) => {
  // Form step state
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Student verification
  const [isStudent, setIsStudent] = useState<boolean | null>(null);
  
  // Form data
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [university, setUniversity] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [studyLevel, setStudyLevel] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");

  const { toast } = useToast();
  const { currency, addExpense, language } = useExpenses();

  // Reset state selections when country changes
  useEffect(() => {
    setState("");
    setUniversity("");
  }, [country]);

  // Reset university selection when state changes
  useEffect(() => {
    setUniversity("");
  }, [state]);

  // Get available countries, states based on selections
  const countries = Object.keys(universitiesByCountryAndState);
  const states = country ? Object.keys(universitiesByCountryAndState[country] || {}) : [];
  const universities = (country && state && universitiesByCountryAndState[country]?.[state]) || [];

  const moveToNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const moveToPrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category || !state || !university || !date) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedUniversityName = universities.find(u => u.id === university)?.name || university;
    
    // Save student expense data for analysis
    const studentData = {
      country,
      region: state,
      university: selectedUniversityName,
      studyLevel,
      monthlyIncome: parseFloat(monthlyIncome)
    };
    localStorage.setItem("studentExpenseData", JSON.stringify(studentData));
    
    addExpense({
      description: `${description} (${selectedUniversityName})`,
      amount: parseFloat(amount),
      currency,
      date: date.toISOString().split('T')[0],
      category: `Student - ${category}`,
      tags: ["Student", category, state, selectedUniversityName, studyLevel],
      notes: `University: ${selectedUniversityName}, State: ${state}, Country: ${country}, Study Level: ${studyLevel}`
    });
    
    toast({
      title: "Student Expense Added",
      description: `${currency}${amount} added for ${category}`
    });
    
    // Reset form
    setDescription("");
    setAmount("");
    setCategory("");
    setUniversity("");
    setState("");
    setCountry("");
    setStudyLevel("");
    setMonthlyIncome("");
    setDate(new Date());
    setCurrentStep(0);
    setIsStudent(null);
    
    // Notify parent component
    onComplete();
  };

  // Step 0: Student verification
  const renderStudentVerification = () => (
    <Card className="bg-gradient-to-br from-card to-background/80 border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl sm:text-2xl">Are you a student?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="flex items-center gap-2 px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
            onClick={() => {
              setIsStudent(true);
              moveToNextStep();
            }}
          >
            <School className="h-5 w-5" />
            Yes, I'm a Student
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="flex items-center gap-2 px-8 py-6 border-primary/20 hover:bg-muted/30 transition-all duration-300"
            onClick={() => {
              setIsStudent(false);
              toast({
                title: "Non-Student Expense",
                description: "Please use the regular expense form for non-student expenses.",
                variant: "default",
              });
            }}
          >
            No, I'm not a Student
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 1: Country selection
  const renderCountrySelection = () => (
    <Card className="bg-gradient-to-br from-card to-background/80 border-border/50 shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Select your country</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-8 py-6">
        <div className="grid gap-4">
          {countries.map((countryName) => (
            <Button
              key={countryName}
              variant={country === countryName ? "default" : "outline"}
              className={`justify-start text-left h-12 ${
                country === countryName 
                  ? "bg-gradient-to-r from-primary to-primary/80" 
                  : "hover:bg-muted/30 transition-all duration-300"
              }`}
              onClick={() => {
                setCountry(countryName);
                moveToNextStep();
              }}
            >
              {countryName}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="ghost" 
            onClick={moveToPrevStep}
            className="hover:bg-muted/30 transition-all duration-300"
          >
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 2: State selection
  const renderStateSelection = () => (
    <Card className="bg-gradient-to-br from-card to-background/80 border-border/50 shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Select your state/region</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-8 py-6">
        <div className="grid gap-4">
          {states.map((stateName) => (
            <Button
              key={stateName}
              variant={state === stateName ? "default" : "outline"}
              className={`justify-start text-left h-12 ${
                state === stateName 
                  ? "bg-gradient-to-r from-primary to-primary/80" 
                  : "hover:bg-muted/30 transition-all duration-300"
              }`}
              onClick={() => {
                setState(stateName);
                moveToNextStep();
              }}
            >
              {stateName}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="ghost" 
            onClick={moveToPrevStep}
            className="hover:bg-muted/30 transition-all duration-300"
          >
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 3: University selection
  const renderUniversitySelection = () => (
    <Card className="bg-gradient-to-br from-card to-background/80 border-border/50 shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Select your university</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-8 py-6">
        <div className="grid gap-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {universities.map((univ) => (
            <Button
              key={univ.id}
              variant={university === univ.id ? "default" : "outline"}
              className={`justify-start text-left h-auto py-3 ${
                university === univ.id 
                  ? "bg-gradient-to-r from-primary to-primary/80" 
                  : "hover:bg-muted/30 transition-all duration-300"
              }`}
              onClick={() => {
                setUniversity(univ.id);
                moveToNextStep();
              }}
            >
              {univ.name}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="ghost" 
            onClick={moveToPrevStep}
            className="hover:bg-muted/30 transition-all duration-300"
          >
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 4: Study level and income
  const renderStudyLevelAndIncome = () => (
    <Card className="bg-gradient-to-br from-card to-background/80 border-border/50 shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Study Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-8 py-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studyLevel">Study Level</Label>
            <Select value={studyLevel} onValueChange={setStudyLevel}>
              <SelectTrigger id="studyLevel" className="transition-all duration-200 focus:ring-2 focus:ring-primary/30">
                <SelectValue placeholder="Select your study level" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-sm">
                {studyLevels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Income/Budget ({currency})</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">{currency}</span>
              <Input
                id="monthlyIncome"
                type="number"
                step="0.01"
                min="0"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="ghost" 
            onClick={moveToPrevStep}
            className="hover:bg-muted/30 transition-all duration-300"
          >
            Back
          </Button>
          
          <Button 
            variant="default"
            onClick={moveToNextStep}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
            disabled={!studyLevel || !monthlyIncome}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 5: Expense details form
  const renderExpenseForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            placeholder="E.g., Semester books"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground">{currency}</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/30"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="transition-all duration-200 focus:ring-2 focus:ring-primary/30">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-sm">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className="w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-primary/30"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card/90 backdrop-blur-sm" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button"
          variant="ghost" 
          onClick={moveToPrevStep}
          className="hover:bg-muted/30 transition-all duration-300"
        >
          Back
        </Button>
        
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
        >
          Add Student Expense
        </Button>
      </div>
    </form>
  );

  // Render the appropriate component based on the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStudentVerification();
      case 1:
        return renderCountrySelection();
      case 2:
        return renderStateSelection();
      case 3:
        return renderUniversitySelection();
      case 4:
        return renderStudyLevelAndIncome();
      case 5:
        return renderExpenseForm();
      default:
        return renderStudentVerification();
    }
  };

  return (
    <div className="space-y-6">
      {renderCurrentStep()}
    </div>
  );
};

export default StudentExpenseForm;
