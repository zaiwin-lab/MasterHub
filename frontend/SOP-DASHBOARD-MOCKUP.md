# SOP — CSS Dashboard Mockup

> How to build a professional dashboard visual in pure HTML/CSS — no screenshots, no images.
> Use in the hero section to show the product without building it.

---

## When to Use

Use a dashboard mockup in the hero when:
- The product IS a dashboard / app / platform
- You want to show "what they'll get" without building the real thing
- The hero needs a visual that's not a stock photo

Skip it when:
- The product is a physical service (catering, events, construction)
- A simpler visual (icon, illustration, stats card) works better

---

## The Pattern

The mockup has 5 layers:

```
┌─ Window Chrome ─────────────────────────┐
│ 🔴 🟡 🟢   [Title]          [Live badge]│
├─ Stats Row ─────────────────────────────┤
│ [Stat 1]      [Stat 2]      [Stat 3]    │
├─ Progress Bar ──────────────────────────┤
│ ████████████░░░░  73% to goal           │
├─ Agent Status List ─────────────────────┤
│ 🟢 Agent Name    [shimmer activity...]  │
│ 🟢 Agent Name    [shimmer activity...]  │
└─────────────────────────────────────────┘
```

---

## Full Code Template

```html
<!-- Wrap in float-anim for hover effect -->
<div class="float-anim">
  <div class="rounded-2xl overflow-hidden shadow-2xl shadow-violet-950"
       style="background:#1A1040; border:1px solid rgba(255,255,255,0.1);">

    <!-- LAYER 1: Window chrome -->
    <div class="px-5 py-3 flex items-center justify-between"
         style="background:#2D1B6E; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="flex items-center gap-2">
        <!-- Traffic lights -->
        <div class="w-3 h-3 rounded-full bg-red-500 opacity-70"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500 opacity-70"></div>
        <div class="w-3 h-3 rounded-full bg-green-500 opacity-70"></div>
        <span class="ml-3 text-gray-300 text-xs font-medium">[Product] Dashboard</span>
      </div>
      <!-- Live badge -->
      <span class="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        AI Live
      </span>
    </div>

    <!-- LAYER 2: Stats row -->
    <div class="p-4 grid grid-cols-3 gap-3">
      <div class="rounded-xl p-3" style="background:rgba(255,255,255,0.05);">
        <div class="text-gray-400 text-xs mb-1">[Stat Label]</div>
        <div class="text-white text-2xl font-black">[Value]</div>
        <div class="text-emerald-400 text-xs mt-1">↑ [Delta]</div>
      </div>
      <div class="rounded-xl p-3" style="background:rgba(255,255,255,0.05);">
        <div class="text-gray-400 text-xs mb-1">[Stat Label]</div>
        <div class="text-white text-2xl font-black">[Value]</div>
        <div class="text-blue-400 text-xs mt-1">[Context]</div>
      </div>
      <div class="rounded-xl p-3" style="background:rgba(255,255,255,0.05);">
        <div class="text-gray-400 text-xs mb-1">[Stat Label]</div>
        <div class="text-white text-xl font-black">[Value]</div>
        <div class="text-emerald-400 text-xs mt-1">[Context]</div>
      </div>
    </div>

    <!-- LAYER 3: Progress bar -->
    <div class="px-4 pb-3">
      <div class="flex justify-between text-xs text-gray-400 mb-1">
        <span>[Goal Label]</span>
        <span class="text-violet-300">[X]% reached</span>
      </div>
      <div class="h-2 rounded-full" style="background:rgba(255,255,255,0.08);">
        <div class="h-2 rounded-full"
             style="width:[X]%; background:linear-gradient(90deg,#7C3AED,#60A5FA);"></div>
      </div>
    </div>

    <!-- LAYER 4: Agent status list -->
    <div class="px-4 pb-4">
      <div class="text-gray-400 text-xs mb-2 uppercase tracking-wider">AI Agents Active</div>
      <div class="space-y-2">
        <!-- Active agent (shimmer = doing work) -->
        <div class="flex items-center gap-2 text-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span class="text-gray-300">[Agent Name]</span>
          <span class="ml-auto text-gray-500 shimmer rounded px-2 py-0.5">[Activity]...</span>
        </div>
        <!-- Ready agent (no shimmer) -->
        <div class="flex items-center gap-2 text-xs">
          <span class="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
          <span class="text-gray-300">[Agent Name]</span>
          <span class="ml-auto text-gray-500">[Status]</span>
        </div>
      </div>
    </div>

  </div>
</div>
```

---

## Stat Ideas by Product Type

### Revenue / Sales system (KBOOST pattern)
```
Stat 1: Leads Today    → 47        ↑ 23% vs yesterday
Stat 2: Pipeline       → 12        Active deals
Stat 3: Revenue        → RM24.5k   This month
Progress: Monthly Target → 73% reached
Agents: Lead Hunter / Copywriter / Appointment Setter
```

### Catering / Events booking
```
Stat 1: Bookings Today → 3         New inquiries
Stat 2: This Month     → 18        Confirmed events
Stat 3: Revenue        → RM12,800  Month to date
Progress: Monthly Target → 64% reached
Agents: Booking Manager / Menu Builder / Invoice Writer
```

### Training / Education
```
Stat 1: Students       → 142       Active learners
Stat 2: Courses        → 8         Running now
Stat 3: Completion     → 87%       Pass rate
Progress: Monthly Enrollment → 91% of target
Agents: Enrollment Bot / Progress Tracker / Certificate Writer
```

---

## Design Rules

- Background: `#1A1040` (dark violet-navy) — never pure black
- Border: `rgba(255,255,255,0.1)` — subtle, not harsh
- Stats: always 3 columns (not 2, not 4)
- Progress bar: gradient left-to-right (`#7C3AED` → `#60A5FA`)
- Emerald green = positive metrics, blue = neutral, amber = warning
- Shimmer only on agents that are "doing work" — max 3 shimmer at once
- Float animation: always wrap the entire card in `.float-anim`
- Shadow: `shadow-2xl shadow-violet-950` on outer div
