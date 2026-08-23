'use client';

import {
  Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Card, CardBody, CardHeader } from '@/components/ui/primitives';

const axis = { fill: 'rgb(var(--c-ink-soft))', fontSize: 11.5 } as const;
const grid = 'rgb(var(--c-tint) / 0.08)';

export const seriesColours = [
  'rgb(var(--c-brand))',
  'rgb(var(--c-info))',
  'rgb(var(--c-gold))',
  'rgb(var(--c-accent))',
  'rgb(var(--c-violet))',
  'rgb(var(--c-warn))',
  'rgb(var(--c-risk))',
];

function tooltipStyle() {
  return {
    contentStyle: {
      borderRadius: 12,
      border: '1px solid rgb(var(--c-line))',
      boxShadow: '0 24px 50px -24px rgb(0 0 0 / 0.85)',
      fontSize: 12.5,
      background: 'rgb(var(--c-raised))',
      color: 'rgb(var(--c-ink))',
    },
    labelStyle: { color: 'rgb(var(--c-violet))', fontWeight: 600, marginBottom: 4 },
  };
}

export function ChartContainer({
  title,
  subtitle,
  action,
  height = 260,
  children,
  footnote,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  height?: number;
  children: React.ReactElement;
  footnote?: string;
}) {
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} action={action} />
      <CardBody className="pt-3">
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
        {footnote ? <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">{footnote}</p> : null}
      </CardBody>
    </Card>
  );
}

/** Props recharts' ResponsiveContainer injects into whatever child it is given. */
type Sized = { width?: number; height?: number };

export function UtilisationTrendChart({
  data,
  currency,
  ...size
}: Sized & {
  data: { month: string; cumulative: number | null; projected: number | null }[];
  currency: string;
}) {
  // Area + Line together require a ComposedChart; an AreaChart silently drops the Line.
  return (
    <ComposedChart {...size} data={data} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
      <defs>
        <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-brand))" stopOpacity={0.38} />
          <stop offset="100%" stopColor="rgb(var(--c-brand))" stopOpacity={0.01} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={grid} vertical={false} />
      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
      <YAxis tickLine={false} axisLine={false} tick={axis} tickFormatter={(v: number) => `${currency}${Math.round(v / 1000)}k`} width={62} />
      <Tooltip {...tooltipStyle()} formatter={(v: number, n: string) => [`${currency}${v.toLocaleString('en-MY')}`, n === 'cumulative' ? 'Approved to date' : 'Straight-line projection']} />
      <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === 'cumulative' ? 'Approved to date' : 'Straight-line projection')} />
      <Area type="monotone" dataKey="cumulative" stroke="rgb(var(--c-brand))" strokeWidth={2} fill="url(#fillCumulative)" connectNulls={false} />
      <Line type="monotone" dataKey="projected" stroke="rgb(var(--c-gold))" strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls />
    </ComposedChart>
  );
}

export function MonthlyBarChart({
  data,
  currency,
  ...size
}: Sized & {
  data: { month: string; approved: number; committed: number }[];
  currency: string;
}) {
  return (
    <BarChart {...size} data={data} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
      <CartesianGrid stroke={grid} vertical={false} />
      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
      <YAxis tickLine={false} axisLine={false} tick={axis} tickFormatter={(v: number) => `${currency}${Math.round(v / 1000)}k`} width={62} />
      <Tooltip {...tooltipStyle()} formatter={(v: number, n: string) => [`${currency}${v.toLocaleString('en-MY')}`, n === 'approved' ? 'Approved' : 'Committed (pending)']} cursor={{ fill: 'rgb(var(--c-tint) / 0.06)' }} />
      <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === 'approved' ? 'Approved' : 'Committed (pending)')} />
      <Bar dataKey="approved" stackId="a" fill="rgb(var(--c-brand))" radius={[0, 0, 0, 0]} />
      <Bar dataKey="committed" stackId="a" fill="rgb(var(--c-violet))" radius={[5, 5, 0, 0]} />
    </BarChart>
  );
}

export function BandsChart({ data, ...size }: Sized & { data: { band: string; employees: number }[] }) {
  const colour = (band: string) =>
    band === '100%+' ? 'rgb(var(--c-risk))' : band === '90–99%' ? 'rgb(var(--c-warn))' : band === '75–89%' ? 'rgb(var(--c-gold))' : 'rgb(var(--c-brand))';
  return (
    <BarChart {...size} data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <CartesianGrid stroke={grid} vertical={false} />
      <XAxis dataKey="band" tickLine={false} axisLine={false} tick={axis} />
      <YAxis tickLine={false} axisLine={false} tick={axis} width={40} allowDecimals={false} />
      <Tooltip {...tooltipStyle()} formatter={(v: number) => [v, 'People']} cursor={{ fill: 'rgb(var(--c-tint) / 0.06)' }} />
      <Bar dataKey="employees" radius={[6, 6, 0, 0]} maxBarSize={54}>
        {data.map((d) => (
          <Cell key={d.band} fill={colour(d.band)} />
        ))}
      </Bar>
    </BarChart>
  );
}

export function CategoryPie({ data, currency, ...size }: Sized & { data: { category: string; amount: number }[]; currency: string }) {
  return (
    <PieChart {...size}>
      <Tooltip {...tooltipStyle()} formatter={(v: number, n: string) => [`${currency}${v.toLocaleString('en-MY')}`, n]} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Pie data={data} dataKey="amount" nameKey="category" innerRadius={52} outerRadius={84} paddingAngle={2} stroke="rgb(var(--c-surface))" strokeWidth={3}>
        {data.map((d, i) => (
          <Cell key={d.category} fill={seriesColours[i % seriesColours.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}

export function UnitBarChart({ data, ...size }: Sized & { data: { unit: string; utilisationPct: number }[] }) {
  return (
    <BarChart {...size} data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
      <defs>
        <linearGradient id="unitFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(var(--c-brand))" stopOpacity={0.55} />
          <stop offset="100%" stopColor="rgb(var(--c-brand))" />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={grid} horizontal={false} />
      <XAxis type="number" tickLine={false} axisLine={false} tick={axis} unit="%" domain={[0, 'dataMax']} />
      <YAxis type="category" dataKey="unit" tickLine={false} axisLine={false} tick={{ ...axis, fontSize: 11 }} width={132} />
      <Tooltip {...tooltipStyle()} formatter={(v: number) => [`${v}%`, 'Utilisation']} cursor={{ fill: 'rgb(var(--c-tint) / 0.06)' }} />
      <Bar dataKey="utilisationPct" fill="url(#unitFill)" radius={[0, 6, 6, 0]} barSize={16} />
    </BarChart>
  );
}

export function PulseLineChart({ data, ...size }: Sized & { data: { month: string; index: number }[] }) {
  return (
    <LineChart {...size} data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <CartesianGrid stroke={grid} vertical={false} />
      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={axis} width={40} />
      <Tooltip {...tooltipStyle()} formatter={(v: number) => [`${v}`, 'Wellbeing index']} />
      <Line type="monotone" dataKey="index" stroke="rgb(var(--c-brand))" strokeWidth={2.5} dot={{ r: 3, fill: 'rgb(var(--c-brand))', strokeWidth: 0 }} activeDot={{ r: 5 }} />
    </LineChart>
  );
}

export function ParticipationChart({ data, ...size }: Sized & { data: { programme: string; registered: number; completed: number }[] }) {
  return (
    <BarChart {...size} data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
      <CartesianGrid stroke={grid} horizontal={false} />
      <XAxis type="number" tickLine={false} axisLine={false} tick={axis} allowDecimals={false} />
      <YAxis type="category" dataKey="programme" tickLine={false} axisLine={false} tick={{ ...axis, fontSize: 11 }} width={168} />
      <Tooltip {...tooltipStyle()} cursor={{ fill: 'rgb(var(--c-tint) / 0.06)' }} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Bar dataKey="registered" name="Registered" fill="rgb(var(--c-brand))" radius={[0, 4, 4, 0]} barSize={12} />
      <Bar dataKey="completed" name="Completed" fill="rgb(var(--c-violet))" radius={[0, 4, 4, 0]} barSize={12} />
    </BarChart>
  );
}
