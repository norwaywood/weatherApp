"use client";

import { useCallback, useEffect, useState } from "react";
import { CloudSun, LocateFixed, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CitySelector } from "@/components/weather/city-selector";
import { CurrentWeatherCard } from "@/components/weather/current-weather-card";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { TemperatureChart } from "@/components/weather/temperature-chart";
import { WeatherDetailsCard } from "@/components/weather/weather-details-card";
import { WeatherSkeleton } from "@/components/weather/weather-skeleton";
import { WeeklyForecast } from "@/components/weather/weekly-forecast";
import { fetchWeather } from "@/lib/weather";
import type { LocationResult, WeatherResponse } from "@/types/weather";

const SEOUL: LocationResult = { id: 1835848, name: "서울", latitude: 37.566, longitude: 126.9784, country: "대한민국", admin1: "서울특별시", timezone: "Asia/Seoul" };

export function WeatherDashboard() {
  const [location, setLocation] = useState<LocationResult>(SEOUL);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (target: LocationResult, silent = false) => {
    const controller = new AbortController();
    try {
      silent ? setRefreshing(true) : setLoading(true);
      setError(null);
      const data = await fetchWeather(target.latitude, target.longitude, controller.signal);
      setWeather(data);
      localStorage.setItem("weather-location", JSON.stringify(target));
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("weather-location");
    const initial = saved ? (JSON.parse(saved) as LocationResult) : SEOUL;
    setLocation(initial);
    void loadWeather(initial);
  }, [loadWeather]);

  function selectLocation(next: LocationResult) {
    setLocation(next);
    void loadWeather(next);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return setError("이 브라우저는 위치 정보를 지원하지 않습니다.");
    setRefreshing(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current: LocationResult = { id: Date.now(), name: "현재 위치", latitude: position.coords.latitude, longitude: position.coords.longitude, country: "", admin1: "GPS" };
        selectLocation(current);
      },
      () => { setRefreshing(false); setError("위치 권한을 허용하면 현재 위치의 날씨를 볼 수 있습니다."); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(99,102,241,.14),_transparent_28%)]">
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg"><CloudSun className="size-6" /></div><div><h1 className="text-xl font-bold tracking-tight">Weatherly</h1><p className="text-xs text-muted-foreground">Open-Meteo 실시간 날씨</p></div></div>
        <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none"><CitySelector location={location} onSelect={selectLocation} /><Button variant="outline" size="icon" title="현재 위치" onClick={useCurrentLocation}><LocateFixed className="size-4" /></Button><Button variant="outline" size="icon" title="새로고침" onClick={() => void loadWeather(location, true)} disabled={refreshing}><RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} /></Button></div>
      </header>

      {loading && <WeatherSkeleton />}
      {!loading && error && !weather && <Card><CardContent className="flex min-h-80 flex-col items-center justify-center text-center"><TriangleAlert className="size-10 text-destructive" /><h2 className="mt-4 text-lg font-semibold">날씨를 불러오지 못했습니다</h2><p className="mt-2 text-sm text-muted-foreground">{error}</p><Button className="mt-5" onClick={() => void loadWeather(location)}>다시 시도</Button></CardContent></Card>}
      {!loading && weather && <>
        {error && <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
        <main className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <CurrentWeatherCard weather={weather} location={location} />
          <WeatherDetailsCard weather={weather} />
          <HourlyForecast weather={weather} />
          <WeeklyForecast weather={weather} />
          <TemperatureChart weather={weather} />
        </main>
        <footer className="mt-5 text-center text-xs text-muted-foreground">날씨 데이터 제공: Open-Meteo · 마지막 업데이트 {new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit" }).format(new Date(weather.current.time))}</footer>
      </>}
    </div>
  </div>;
}
