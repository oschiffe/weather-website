import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { InstagramImage } from '../../types/api';

// Note: This is a mock implementation as Instagram's public API has significant limitations
// and requires authentication with specific permissions
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { location } = req.query;
  
  if (!location) {
    return res.status(400).json({ message: 'Location parameter is required' });
  }

  try {
    // We'll generate mock data based on the location
    // In a real application, you would need to use Instagram's API with appropriate authentication
    
    // Create a seed based on the location string for consistent but varied results
    const seed = Array.from(location as string).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Mock data that varies based on the location
    const mockImages: InstagramImage[] = generateMockInstagramImages(location as string, seed);
    
    return res.status(200).json(mockImages);
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    return res.status(500).json({ message: 'Error fetching Instagram data' });
  }
}

function generateMockInstagramImages(location: string, seed: number): InstagramImage[] {
  const locationName = location.toLowerCase().replace(/[^a-z0-9]/g, '');
  const rng = createSeededRandom(seed);
  
  // Generate 12 mock Instagram images
  return Array.from({ length: 12 }, (_, i) => {
    const id = `${locationName}-${i}-${Date.now()}`;
    const username = mockUsernames[Math.floor(rng() * mockUsernames.length)];
    
    return {
      id,
      url: `https://source.unsplash.com/600x600/?${encodeURIComponent(location)},woman,beautiful/${id}`,
      username,
      profileUrl: `https://instagram.com/${username}`,
      profilePicture: `https://source.unsplash.com/100x100/?portrait,face/${username}`,
      caption: mockCaptions[Math.floor(rng() * mockCaptions.length)].replace('{location}', location),
      timestamp: new Date(Date.now() - Math.floor(rng() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      likes: Math.floor(rng() * 10000) + 500,
    };
  });
}

// Seeded random number generator
function createSeededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Mock data for usernames and captions
const mockUsernames = [
  'sophia_travel', 'emma_styles', 'olivia_beauty', 'ava_glamour', 'isabella_mode',
  'mia_fashion', 'amelia_chic', 'harper_elegant', 'evelyn_graceful', 'abigail_trendy',
  'elizabeth_vogue', 'charlotte_runway', 'grace_couture', 'zoe_aesthetic', 'lily_luxe',
  'victoria_glam', 'madison_stylist', 'luna_photogenic', 'chloe_captures', 'penelope_lens'
];

const mockCaptions = [
  'Living my best life in {location} ✨',
  'Golden hour in {location} is simply magical 🌞',
  'Exploring the beautiful streets of {location} today 🚶‍♀️',
  'Found this perfect spot in {location} 💕',
  '{location} views that take my breath away 😍',
  'Coffee and wandering through {location} 🥤',
  'The perfect day in {location} doesn\'t exi— oh wait, it does ✨',
  'Just another day in paradise 🌴 {location}',
  'When in {location}, do as the locals do 💫',
  'Falling in love with {location} all over again 💖',
  'That {location} glow ✨',
  'Checking {location} off my bucket list ✓',
  '{location} sunsets hit different 🌅',
  'Weekends are for exploring {location} 🗺️',
  'Feeling blessed in {location} 🙏'
]; 