import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { toast } from 'sonner';

const teamMembers = [
  {
    name: 'Dr. Maria Santos',
    role: 'Faculty Advisor',
    bio: 'Professor of Computer Science with 15 years of experience in software engineering and database systems.',
    initials: 'MS'
  },
  {
    name: 'Prof. Juan Dela Cruz',
    role: 'Technical Advisor',
    bio: 'Expert in web development and system architecture with a focus on educational technology.',
    initials: 'JD'
  },
  {
    name: 'Student Developer Team',
    role: 'Development Team',
    bio: 'A dedicated team of senior computer science students passionate about creating innovative solutions.',
    initials: 'DT'
  }
];

interface AboutContent {
  title: string;
  subtitle: string;
  mission: string;
  contactEmail: string;
}

export default function GuestAbout() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<AboutContent>({
    title: 'About CapSort',
    subtitle: 'Capstone Archiving and Sorting System',
    mission: 'CapSort is designed to provide an efficient and user-friendly platform for archiving, organizing, and discovering capstone projects from the University of Science and Technology of Southern Philippines. Our goal is to preserve the innovative work of students and make it accessible to future generations of learners and researchers.',
    contactEmail: 'capsort@ustp.edu.ph'
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ content: AboutContent }>('/about');
      
      if (response.data?.content) {
        setContent({
          title: response.data.content.title,
          subtitle: response.data.content.subtitle,
          mission: response.data.content.mission,
          contactEmail: response.data.content.contactEmail
        });
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
      // Keep default content if fetch fails
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <Navbar role="guest" />
        <div className="container mx-auto px-8 py-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a1851]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar role="guest" />

      <div className="container mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-['Poppins'] text-[48px] text-[#1a1851] mb-4">{content.title}</h1>
          <p className="font-['Poppins'] text-[20px] text-[#1e1e1e] max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 rounded-[15px]">
          <CardContent className="p-8">
            <h2 className="font-['Poppins'] text-[32px] text-[#1a1851] mb-4">Our Mission</h2>
            <p className="font-['Poppins'] text-[18px] text-[#1e1e1e] leading-relaxed">
              {content.mission}
            </p>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="rounded-[15px]">
            <CardContent className="p-6">
              <h3 className="font-['Poppins'] text-[24px] text-[#1a1851] mb-3">Easy Search</h3>
              <p className="font-['Poppins'] text-[16px] text-[#1e1e1e]">
                Quickly find relevant capstone papers using our advanced filtering system.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[15px]">
            <CardContent className="p-6">
              <h3 className="font-['Poppins'] text-[24px] text-[#1a1851] mb-3">Organized</h3>
              <p className="font-['Poppins'] text-[16px] text-[#1e1e1e]">
                Projects are categorized by field, year, and author for easy navigation.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[15px]">
            <CardContent className="p-6">
              <h3 className="font-['Poppins'] text-[24px] text-[#1a1851] mb-3">Accessible</h3>
              <p className="font-['Poppins'] text-[16px] text-[#1e1e1e]">
                Open to students, faculty, and guests to explore innovative projects.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="font-['Poppins'] text-[36px] text-[#1a1851] text-center mb-8">
            Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="rounded-[15px]">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[#1a1851] text-white text-[24px]">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-['Poppins'] text-[20px] text-[#1a1851] mb-2">
                    {member.name}
                  </h3>
                  <p className="font-['Poppins'] text-[14px] text-[#FFD338] mb-3">
                    {member.role}
                  </p>
                  <p className="font-['Poppins'] text-[14px] text-[#1e1e1e]">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card className="rounded-[15px] bg-[#1a1851] text-white">
          <CardContent className="p-8 text-center">
            <h2 className="font-['Poppins'] text-[32px] mb-4">Get in Touch</h2>
            <p className="font-['Poppins'] text-[18px] mb-6">
              Have questions or suggestions? We'd love to hear from you.
            </p>
            <p className="font-['Poppins'] text-[16px]">
              Email: {content.contactEmail}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
