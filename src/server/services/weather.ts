/**
 * Open-Meteo Weather Service
 * Free, key-less weather forecast API with 30-minute caching and graceful fallback.
 * Terms require attribution: "Weather data by Open-Meteo.com" (https://open-meteo.com/)
 */

export type { CurrentWeather, DailyForecast, WeatherResult } from "@/shared/types/weather";
import type { WeatherResult } from "@/shared/types/weather";

// 30-minute in-memory cache
const WEATHER_CACHE_TTL_MS = 30 * 60 * 1000;
const weatherCache = new Map<string, { data: WeatherResult; timestamp: number }>();

export function clearWeatherCache(): void {
  weatherCache.clear();
}

/**
 * Maps WMO Weather Interpretation Codes to human descriptions
 * https://open-meteo.com/en/docs
 */
export function describeWmoCode(code: number): string {
  switch (code) {
    case 0:
      return "Clear Sky";
    case 1:
      return "Mainly Clear";
    case 2:
      return "Partly Cloudy";
    case 3:
      return "Overcast";
    case 45:
    case 48:
      return "Foggy / Mist";
    case 51:
    case 53:
    case 55:
      return "Drizzle";
    case 56:
    case 57:
      return "Freezing Drizzle";
    case 61:
    case 63:
    case 65:
      return "Rain Showers";
    case 66:
    case 67:
      return "Freezing Rain";
    case 71:
    case 73:
    case 75:
      return "Snowfall";
    case 77:
      return "Snow Grains";
    case 80:
    case 81:
    case 82:
      return "Heavy Rain Showers";
    case 85:
    case 86:
      return "Snow Showers";
    case 95:
      return "Thunderstorm";
    case 96:
    case 99:
      return "Thunderstorm with Hail";
    default:
      return "Pleasant & Clear";
  }
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Deterministic fallback weather when Open-Meteo API is unreachable or fails
 */
export function getFallbackWeather(lat: number, lng: number): WeatherResult {
  // Approximate seasonal temp from latitude: northern hill stations are cooler
  const isNorthernMountain = lat > 28;
  const isSouthernHill = lat < 15 && lng > 75;
  const baseTemp = isNorthernMountain ? 12 : isSouthernHill ? 18 : 26;

  const now = new Date();
  const daily: DailyForecast[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dayName = DAY_NAMES[d.getDay()] || "Day";
    const dateStr = d.toISOString().slice(0, 10);
    const variance = (i % 3) - 1;

    daily.push({
      date: dateStr,
      dayName,
      weatherCode: 1,
      condition: "Mainly Clear",
      tempMax: Math.round(baseTemp + 4 + variance),
      tempMin: Math.round(baseTemp - 3 + variance),
      precipitationProbability: (i * 10) % 35,
    });
  }

  return {
    current: {
      temperature: baseTemp,
      condition: "Mainly Clear",
      weatherCode: 1,
      humidity: 55,
      windSpeed: 8,
      fetchedAt: Date.now(),
    },
    daily,
    attribution: "Weather data by Open-Meteo.com (Offline Fallback)",
    attributionUrl: "https://open-meteo.com/",
    isFallback: true,
    latitude: lat,
    longitude: lng,
  };
}

/**
 * Fetch live current weather + 7-day forecast from Open-Meteo
 */
export async function fetchWeatherForecast(lat: number, lng: number): Promise<WeatherResult> {
  const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_TTL_MS) {
    return cached.data;
  }

  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`Open-Meteo API returned status ${res.status}. Using fallback weather.`);
      return getFallbackWeather(lat, lng);
    }

    const json = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        weather_code?: number;
        wind_speed_10m?: number;
      };
      daily?: {
        time?: string[];
        weather_code?: number[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: number[];
      };
    };

    if (!json.current || !json.daily || !json.daily.time) {
      console.warn("Open-Meteo response missing required fields. Using fallback.");
      return getFallbackWeather(lat, lng);
    }

    const currentCode = json.current.weather_code ?? 0;
    const currentTemp = Math.round((json.current.temperature_2m ?? 20) * 10) / 10;

    const daily: DailyForecast[] = [];
    const count = Math.min(json.daily.time.length, 7);

    for (let i = 0; i < count; i++) {
      const dateStr = json.daily.time[i] ?? "";
      const code = json.daily.weather_code?.[i] ?? 0;
      const d = new Date(dateStr);
      const dayName = isNaN(d.getTime()) ? `Day ${i + 1}` : (DAY_NAMES[d.getDay()] ?? "Day");

      daily.push({
        date: dateStr,
        dayName,
        weatherCode: code,
        condition: describeWmoCode(code),
        tempMax: Math.round((json.daily.temperature_2m_max?.[i] ?? currentTemp + 3) * 10) / 10,
        tempMin: Math.round((json.daily.temperature_2m_min?.[i] ?? currentTemp - 4) * 10) / 10,
        precipitationProbability: json.daily.precipitation_probability_max?.[i] ?? 0,
      });
    }

    const result: WeatherResult = {
      current: {
        temperature: currentTemp,
        condition: describeWmoCode(currentCode),
        weatherCode: currentCode,
        humidity: json.current.relative_humidity_2m ?? 50,
        windSpeed: Math.round((json.current.wind_speed_10m ?? 5) * 10) / 10,
        fetchedAt: Date.now(),
      },
      daily,
      attribution: "Weather data by Open-Meteo.com",
      attributionUrl: "https://open-meteo.com/",
      isFallback: false,
      latitude: lat,
      longitude: lng,
    };

    // Store in cache
    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (err) {
    console.warn("Failed to fetch weather from Open-Meteo:", err);
    return getFallbackWeather(lat, lng);
  }
}
