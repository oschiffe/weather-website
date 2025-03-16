import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion } from 'framer-motion';

// Team member type
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

// Feature type
interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function About() {
  // Team members data
  const team: TeamMember[] = [
    {
      name: 'Alex Johnson',
      role: 'Lead Developer',
      bio: 'Alex has over 10 years of experience in web development and a passion for creating intuitive user interfaces.',
      avatar: '/team/avatar1.jpg',
    },
    {
      name: 'Sam Richards',
      role: 'UX Designer',
      bio: 'Sam brings creative solutions to complex problems with a focus on accessibility and user experience.',
      avatar: '/team/avatar2.jpg',
    },
    {
      name: 'Jamie Chen',
      role: 'Meteorologist',
      bio: 'Jamie provides expert analysis of weather patterns and ensures accurate forecasting data.',
      avatar: '/team/avatar3.jpg',
    },
    {
      name: 'Taylor Smith',
      role: 'Product Manager',
      bio: 'Taylor oversees the product roadmap and ensures that user needs are prioritized in each release.',
      avatar: '/team/avatar4.jpg',
    },
  ];
  
  // Features data
  const features: Feature[] = [
    {
      title: 'Real-time Updates',
      description: 'Get accurate weather data with minute-by-minute updates for your location.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Interactive Maps',
      description: 'Explore detailed weather patterns with our interactive map layers.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: 'Personalized Alerts',
      description: 'Receive customized notifications for severe weather events in your area.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      title: 'Historical Data',
      description: 'Access weather history and trends to better understand climate patterns.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];
  
  return (
    <Layout title="About - Weather App">
      {/* Hero section */}
      <div className="bg-primary/5 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4">
              About Our Weather App
            </h1>
            <p className="text-lg text-secondary-light max-w-3xl mx-auto">
              Providing accurate, real-time weather information with a beautiful, intuitive interface designed for everyday use.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* App mission section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
              Our Mission
            </h2>
            <p className="text-secondary-light mb-4">
              We built this weather application with a singular focus: to provide the most accurate, easy-to-understand weather information possible. Whether you're planning your day, preparing for travel, or monitoring severe weather, our goal is to give you the information you need in a beautiful, intuitive interface.
            </p>
            <p className="text-secondary-light mb-6">
              By combining cutting-edge meteorological data with thoughtful design, we've created a weather experience that keeps you informed without overwhelming you with unnecessary details.
            </p>
            <Button variant="primary" size="lg">
              Learn More About Our Data
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-apple-lg">
            <img 
              src="/about/mission.jpg" 
              alt="Weather station" 
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Weather+App';
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Features section */}
      <div className="bg-gradient-to-b from-primary/5 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
              Key Features
            </h2>
            <p className="text-secondary-light max-w-3xl mx-auto">
              Designed with you in mind, our app includes features that make checking the weather effortless and informative.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <Card variant="elevated" padding="lg" className="h-full">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-secondary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-light">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Team section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
            Meet Our Team
          </h2>
          <p className="text-secondary-light max-w-3xl mx-auto">
            The passionate people behind the development of our weather application.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <Card variant="glass" padding="lg" className="text-center h-full">
                <div className="mb-4 relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary/20">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                    }}
                  />
                </div>
                <h3 className="text-lg font-medium text-secondary">
                  {member.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-secondary-light text-sm">
                  {member.bio}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Contact section */}
      <div className="bg-primary/5 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
              Get in Touch
            </h2>
            <p className="text-secondary-light mb-8">
              Have questions or feedback about our weather app? We'd love to hear from you.
            </p>
            <Card variant="elevated" padding="lg">
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1 mb-4 md:mb-0">
                  <Button variant="primary" fullWidth>
                    Contact Support
                  </Button>
                </div>
                <div className="flex-1">
                  <Button variant="ghost" fullWidth>
                    Send Feature Request
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 