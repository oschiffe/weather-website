export interface WeatherData {
  name: string;
  country: string;
  condition: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  pressure: number;
  visibility: number;
  lat: number;
  lon: number;
  timezone: number;
}

export interface InstagramImage {
  id: string;
  url: string;
  caption: string;
  likes: number;
  username: string;
  profilePicture: string;
  profileUrl: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  precipitation: number;
}

export interface DailyForecast {
  date: string;
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  precipitation: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface PlacePrediction {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails {
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
} 