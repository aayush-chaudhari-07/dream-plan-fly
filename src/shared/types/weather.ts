/**
 * Weather data types shared across client and server.
 */

export type CurrentWeather = {
  temperature: number; // in °C
  condition: string;
  weatherCode: number;
  humidity: number; // in %
  windSpeed: number; // in km/h
  fetchedAt: number;
};

export type DailyForecast = {
  date: string; // "YYYY-MM-DD"
  dayName: string; // "Mon", "Tue", etc.
  weatherCode: number;
  condition: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number; // in %
};

export type WeatherResult = {
  current: CurrentWeather;
  daily: DailyForecast[];
  attribution: string;
  attributionUrl: string;
  isFallback: boolean;
  latitude: number;
  longitude: number;
};
