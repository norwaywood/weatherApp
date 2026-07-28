import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function WeatherIcon({ code, isDay = true, className }: { code: number; isDay?: boolean; className?: string }) {
  const props = { className: cn("shrink-0", className), strokeWidth: 1.8, "aria-hidden": true };
  if (code === 0) return isDay ? <Sun {...props} /> : <Moon {...props} />;
  if ([1, 2].includes(code)) return <CloudSun {...props} />;
  if (code === 3) return <Cloud {...props} />;
  if ([45, 48].includes(code)) return <CloudFog {...props} />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle {...props} />;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain {...props} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow {...props} />;
  if ([95, 96, 99].includes(code)) return <CloudLightning {...props} />;
  return <Cloud {...props} />;
}

