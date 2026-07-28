
import type { LocationResult, WeatherResponse } from "@/types/weather";

const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchLocations(query: string, signal?: AbortSignal): Promise<LocationResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    name: trimmed,
    count: "8",
    language: "ko",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_ENDPOINT}?${params}`, { signal });
  if (!response.ok) throw new Error("도시 검색에 실패했습니다.");
  const data = (await response.json()) as { results?: LocationResult[] };
  return data.results ?? [];
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: "auto",
    forecast_days: "8",
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "surface_pressure",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    hourly: [
      "temperature_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "weather_code",
      "relative_humidity_2m",
      "wind_speed_10m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "sunrise",
      "sunset",
      "uv_index_max",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
    ].join(","),
  });

  const response = await fetch(`${FORECAST_ENDPOINT}?${params}`, { signal });
  if (!response.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");
  return response.json() as Promise<WeatherResponse>;
}

export function weatherLabel(code: number) {
  if (code === 0) return "맑음";
  if ([1, 2].includes(code)) return "대체로 맑음";
  if (code === 3) return "흐림";
  if ([45, 48].includes(code)) return "안개";
  if ([51, 53, 55, 56, 57].includes(code)) return "이슬비";
  if ([61, 63, 65, 66, 67].includes(code)) return "비";
  if ([71, 73, 75, 77].includes(code)) return "눈";
  if ([80, 81, 82].includes(code)) return "소나기";
  if ([85, 86].includes(code)) return "눈 소나기";
  if ([95, 96, 99].includes(code)) return "뇌우";
  return "날씨 정보";
}

export function getNext24Hours(weather: WeatherResponse) {
  const currentMs = new Date(weather.current.time).getTime();
  let start = weather.hourly.time.findIndex((time) => new Date(time).getTime() >= currentMs);
  if (start < 0) start = 0;

  return weather.hourly.time.slice(start, start + 24).map((time, offset) => {
    const index = start + offset;
    return {
      time,
      temperature: weather.hourly.temperature_2m[index],
      apparentTemperature: weather.hourly.apparent_temperature[index],
      precipitationProbability: weather.hourly.precipitation_probability[index],
      precipitation: weather.hourly.precipitation[index],
      weatherCode: weather.hourly.weather_code[index],
      humidity: weather.hourly.relative_humidity_2m[index],
      windSpeed: weather.hourly.wind_speed_10m[index],
    };
  });
}

export function formatHour(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", { hour: "numeric", hour12: true }).format(new Date(iso));
}

export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("ko-KR", options ?? { month: "long", day: "numeric", weekday: "long" }).format(new Date(iso));
}

export function windDirectionLabel(degrees: number) {
  const labels = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];
  return labels[Math.round(degrees / 45) % 8];
}
