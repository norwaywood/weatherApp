import { Droplets, Gauge, Sunrise, Sunset, Thermometer, Umbrella, Wind } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { windDirectionLabel } from "@/lib/weather";
import type { WeatherResponse } from "@/types/weather";

function Detail({ icon: Icon, label, value, hint }: { icon: typeof Droplets; label: string; value: string; hint?: string }) {
  return <div className="rounded-2xl border bg-background/60 p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="size-4 text-primary" />{label}</div><p className="mt-2 text-lg font-semibold">{value}</p>{hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}</div>;
}

export function WeatherDetailsCard({ weather }: { weather: WeatherResponse }) {
  const c = weather.current;
  const d = weather.daily;
  const time = (iso: string) => new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
  return (
    <Card className="lg:col-span-5">
      <CardHeader><CardTitle>오늘의 상세 정보</CardTitle><CardDescription>현재 관측값과 오늘의 주요 지표</CardDescription></CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Detail icon={Thermometer} label="체감온도" value={`${Math.round(c.apparent_temperature)}°`} />
        <Detail icon={Droplets} label="습도" value={`${c.relative_humidity_2m}%`} />
        <Detail icon={Wind} label="바람" value={`${c.wind_speed_10m.toFixed(1)} km/h`} hint={`${windDirectionLabel(c.wind_direction_10m)}풍`} />
        <Detail icon={Umbrella} label="강수확률" value={`${d.precipitation_probability_max[0]}%`} />
        <Detail icon={Sunrise} label="일출" value={time(d.sunrise[0])} />
        <Detail icon={Sunset} label="일몰" value={time(d.sunset[0])} />
        <Detail icon={Gauge} label="기압" value={`${Math.round(c.surface_pressure)} hPa`} />
        <Detail icon={Droplets} label="오늘 강수량" value={`${d.precipitation_sum[0].toFixed(1)} mm`} />
      </CardContent>
    </Card>
  );
}
