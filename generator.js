/**
 * Concurrent Training Engine
 * Fysiologisk schemagenerator baserad på principer om signalvägsseparation (mTOR vs AMPK),
 * residual trötthet och volymprogression.
 */

function generateConcurrentProgram(formData) {
  const isPPL = formData.split === 'PPL';
  const hasDoubles = formData.doubleSessions.startsWith('Ja');

  // Grundläggande fysiologisk motivering
  const rationale = `
    <strong>Fysiologisk design:</strong> Primärt mål är <em>${formData.prio1}</em>, med sekundärt mål <em>${formData.prio2}</em>.
    För att motverka akut interferenseffekt (där AMPK från konditionsträning hämmar proteinsyntesen via mTORC1) placeras morgonlöpningen 
    som ren lågintensiv Zon 2 (fettförbränning, mitokondriebildning). Styrkepassen genomförs minst 6–8 timmar senare 
    med intag av kolhydrater och leucinrikt protein däremellan.
  `;

  // 4-veckors progressionstrappa
  const weeks = [
    {
      weekNumber: 1,
      title: "Acklimatiseringsvecka (Intro)",
      description: "Baslinjevolym. Hitta rätt RIR och säkerställ att benstyrka inte skapar systemisk trötthet före löpning.",
      volumeModifier: 1.0,
      intensityNote: "RPE 7-8 / RIR 2-3",
      days: buildWeekSchedule(1, isPPL, hasDoubles, formData)
    },
    {
      weekNumber: 2,
      title: "Volymackumulation",
      description: "Ökad set-volym på överkropp och ökad distans (+10%) på långa Zon 2-passet.",
      volumeModifier: 1.15,
      intensityNote: "RPE 8 / RIR 2",
      days: buildWeekSchedule(2, isPPL, hasDoubles, formData)
    },
    {
      weekNumber: 3,
      title: "Intensitetstopp (Overreach)",
      description: "Högsta mekaniska spänning. Tunga lyft och tröskelintervaller. Förbereder superkompensation.",
      volumeModifier: 1.25,
      intensityNote: "RPE 8.5-9 / RIR 1",
      days: buildWeekSchedule(3, isPPL, hasDoubles, formData)
    },
    {
      weekNumber: 4,
      title: "Deload & Superkompensation",
      description: "Minska set-volymen med 40-50% och löpsträckan med 35%. Behåll intensitet på första setet för att bevara neuromuskulär adaptation.",
      volumeModifier: 0.6,
      intensityNote: "RPE 6-7 / RIR 3-4",
      days: buildWeekSchedule(4, isPPL, hasDoubles, formData)
    }
  ];

  return {
    formData,
    rationale,
    weeks
  };
}

function buildWeekSchedule(weekNum, isPPL, hasDoubles, data) {
  const isDeload = weekNum === 4;
  const setsBase = isDeload ? "2" : (weekNum === 3 ? "4" : "3-4");

  return [
    {
      day: "Måndag",
      title: "Löpning (Zon 2 Aerob Bas) + Gym (Push)",
      timing: hasDoubles ? "Morgon kl 07:00 (Löpning) | Kväll kl 17:30 (Gym)" : "Pass fördelat över dagen",
      interferenceRule: "Löpningen sker i Zon 2 (<75% maxpuls). Glykogendepåer bevaras för kvällens pressövningar.",
      sessions: [
        {
          type: "Löpning",
          name: `Morgonjogg Zon 2 Distans (${isDeload ? '4.0 km' : '5.5 km'})`,
          protocol: `Pulszon: Zon 2 (130-142 bpm) | Fart: 5:40-6:00 min/km | Tid: ca ${isDeload ? '24' : '32'} min` }, { type: "Gym", name: "Push — Bröst, Axlar & Triceps", exercises: [ { name: "Bänkpress med skivstång", sets: `${setsBase} x 6-8`, rir: isDeload ? "RIR 3" : "RIR 2", rest: "2.5 min" },
            { name: "Lutande hantelpress", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "2 min" }, { name: "Militärpress / Stående axelpress", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "90 sek" },
            { name: "Sidolyft med kabel/hantlar", sets: "3 x 12-15", rir: "RIR 1-2", rest: "60 sek" },
            { name: "Triceps pushdowns i kabel", sets: "3 x 10-12", rir: "RIR 1", rest: "60 sek" }
          ]
        }
      ]
    },
    {
      day: "Tisdag",
      title: "Gym (Pull — Explosiv Dragstyrka & Hypertrofi)",
      timing: "Eftermiddag / Kväll",
      interferenceRule: "Ingen löpning idag. Fokus på maximal neuromuskulär rekrytering för lats och räckhäv.",
      sessions: [
        {
          type: "Gym",
          name: "Pull — Rygg, Biceps & Explosiva Chins",
          exercises: [
            { name: "Explosiva Chins / Högdrag mot stång (Muscle-up prep)", sets: isDeload ? "3 x 3" : "4 x 4-5", rir: "Maximal power / RIR 2", rest: "2.5 min" },
            { name: "Skivstångsrodd (Pendlay eller 45-graders)", sets: `${setsBase} x 6-8`, rir: "RIR 2", rest: "2 min" }, { name: "Breda latsdrag", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "90 sek" },
            { name: "Omvända flyes / Facepulls (Baksida axlar)", sets: "3 x 12-15", rir: "RIR 1", rest: "60 sek" },
            { name: "Stående skivstångs- eller hantelcurls", sets: "3 x 8-10", rir: "RIR 1", rest: "90 sek" },
            { name: "Cable Crunches (Bål)", sets: "3 x 12", rir: "RIR 2", rest: "60 sek" }
          ]
        }
      ]
    },
    {
      day: "Onsdag",
      title: "Löpning (Tröskel / Fartlek) — Inget tungt gym",
      timing: "Morgon eller eftermiddag",
      interferenceRule: "Håll överkroppen vilande. Inga tunga benböj genomförs dagen före eller under detta pass.",
      sessions: [
        {
          type: "Löpning",
          name: isDeload ? "Lugn distans 4 km Zon 2" : "Tröskelintervaller 4 x 1000m",
          protocol: isDeload 
            ? "4 km kontinuerlig återhämtningslöpning i Zon 2"
            : "Uppvärmning 1.5 km + 4 x 1000m i Zon 4 (4:15-4:25 min/km) med 90s gåvila + Nedjogg 1 km"
        }
      ]
    },
    {
      day: "Torsdag",
      title: "Gym (Legs & Bål) — Löpspecifik Styrka",
      timing: "Kväll",
      interferenceRule: "OBS: Minst 36 timmar till nästa kvalitetslöpning. Benstyrka förläggs här för att skydda hälsenor och knän.",
      sessions: [
        {
          type: "Gym",
          name: "Legs — Knäböj, Hamstrings & Vadstyrka",
          exercises: [
            { name: "Knäböj (Back Squat)", sets: isDeload ? "2 x 5" : "3-4 x 6-8", rir: "RIR 2", rest: "3 min" },
            { name: "Rumänska marklyft (RDL)", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "2 min" }, { name: "Benspark i maskin", sets: "3 x 10-12", rir: "RIR 1-2", rest: "90 sek" }, { name: "Stående vadpress (Akillessenaprevention)", sets: "4 x 12-15", rir: "RIR 1 (kontrollerad excentrisk)", rest: "60 sek" }, { name: "Hängande benlyft", sets: "3 x 10-12", rir: "RIR 2", rest: "60 sek" } ] } ] }, { day: "Fredag", title: "Aktiv Återhämtning / Lätt Morgonjogg Zon 1-2", timing: "Morgon kl 07:00", interferenceRule: "Spola ur metaboliter från bendagen utan att skapa ny muskelskada. Endast mjukt tempo.", sessions: [ { type: "Löpning", name: "Flush Run & Mobilitet", protocol: `Distans: ${isDeload ? '3.5 km' : '4.5 km'} i lugn Zon 1-2 (<135 bpm). Avsluta med dynamisk rörlighet för höftböjare.`
        }
      ]
    },
    {
      day: "Lördag",
      title: "Överkropp Volym + Calisthenics",
      timing: "Förmiddag",
      interferenceRule: "Ingen benträning. Fräscha ben förbereds inför söndagens längre aeroba distanspass.",
      sessions: [
        {
          type: "Gym",
          name: "Upper Body Hypertrophy",
          exercises: [
            { name: "Dips (Kroppsvikt eller viktbälte)", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "2 min" }, { name: "Hantelrodd på bänk", sets: `${setsBase} x 10-12`, rir: "RIR 1-2", rest: "90 sek" },
            { name: "Stående hantelpress för axlar", sets: "3 x 10", rir: "RIR 2", rest: "90 sek" },
            { name: "Preacher curls / Hammer curls", sets: "3 x 10-12", rir: "RIR 1", rest: "60 sek" }
          ]
        }
      ]
    },
    {
      day: "Söndag",
      title: "Långpass Löpning (Aerob Bas / Mitokondriell täthet)",
      timing: "Morgon / Förmiddag",
      interferenceRule: "Veckans längsta aeroba pass. Genomförs på fastande mage eller lätt kolhydratintag för att stimulera fettmetabolism.",
      sessions: [
        {
          type: "Löpning",
          name: `Zon 2 Long Run (${isDeload ? '6.0 km' : '8.5-10.0 km'})`, protocol: "Prattempo (Zon 2, 132-144 bpm). Inga spurter. Fokus på kadens runt 172-180 steg/min." } ] } ]; } ```  ---  ### 4. `app.js`  Klistra in följande kod i `app.js`. Den hanterar flikar, Garmin-synkning, träningslogg, avatar-redigering, kompis-topplista och Canvas-grafer:  ```javascript /** * HybridOS App Logic & State Management */  // Global State const state = { activeTab: 'dashboard', selectedWeek: 1, user: { name: "Hybrid Athlete", level: 4, xp: 1420, archetype: "Hybrid Engine", color: "#10b981", avatarIcon: "⚡" }, workouts: [ { id: 1, date: "2026-11-04", type: "Löpning", title: "Morgonjogg Zon 2", metric: "5.5 km", duration: 31, notes: "Zon 2, puls 136 bpm, Garmin sync" }, { id: 2, date: "2026-11-04", type: "Gym - Pull", title: "Pull & Explosiva Chins", metric: "6 400 kg", duration: 65, notes: "Explosiva chins med +15kg bälte" }, { id: 3, date: "2026-11-02", type: "Gym - Push", title: "Push Tung Bänk", metric: "8 200 kg", duration: 70, notes: "Bänk 100kg 3x5" } ], leaderboard: [ { rank: 1, name: "Marcus 'Oxen'", level: 6, weeklyVol: "28 km / 32t", points: 3450 }, { rank: 2, name: "Hybrid Athlete (Du)", level: 4, weeklyVol: "22 km / 24t", points: 2970, isMe: true }, { rank: 3, name: "Elin K.", level: 4, weeklyVol: "35 km / 14t", points: 2840 }, { rank: 4, name: "Johan S.", level: 3, weeklyVol: "15 km / 26t", points: 2210 } ], generatedPlan: null };  // Init on DOM Load document.addEventListener('DOMContentLoaded', () => { loadSavedState(); initNavigation(); initCoachForm(); initWeekSelector(); initWorkoutLogger(); initGarminMock(); initGamification(); renderDashboard(); renderAnalyticsCharts(); });  // Navigation Handling function initNavigation() { const buttons = document.querySelectorAll('.nav-btn'); buttons.forEach(btn => { btn.addEventListener('click', () => { const targetTab = btn.getAttribute('data-tab'); switchTab(targetTab); }); }); }  function switchTab(tabId) { state.activeTab = tabId; document.querySelectorAll('.nav-btn').forEach(b => { b.classList.toggle('active', b.getAttribute('data-tab') === tabId); }); document.querySelectorAll('.tab-view').forEach(view => { view.classList.toggle('active', view.id === `tab-${tabId}`);
  });

  if (tabId === 'analytics') {
    renderAnalyticsCharts();
  }
}

// Coach Form Generation
function initCoachForm() {
  const btnGen = document.getElementById('btn-generate-plan');
  btnGen.addEventListener('click', () => {
    const formData = {
      age: document.getElementById('f-age').value,
      gender: document.getElementById('f-gender').value,
      heightWeight: document.getElementById('f-height-weight').value,
      background: document.getElementById('f-background').value,
      strengthLevel: document.getElementById('f-strength-level').value,
      cardioLevel: document.getElementById('f-cardio-level').value,
      injuries: document.getElementById('f-injuries').value,
      prio1: document.getElementById('f-prio1').value,
      prio2: document.getElementById('f-prio2').value,
      timeframe: document.getElementById('f-timeframe').value,
      milestones: document.getElementById('f-milestones').value,
      daysPerWeek: document.getElementById('f-days-per-week').value,
      sessionDuration: document.getElementById('f-session-duration').value,
      doubleSessions: document.getElementById('f-double-sessions').value,
      equipment: document.getElementById('f-equipment').value,
      split: document.getElementById('f-split').value,
      focusExercises: document.getElementById('f-focus-exercises').value,
      excludeExercises: document.getElementById('f-exclude-exercises').value,
      cardioType: document.getElementById('f-cardio-type').value,
      cardioDistribution: document.getElementById('f-cardio-distribution').value,
      weeklyRunningVol: document.getElementById('f-weekly-running-vol').value,
      sleep: document.getElementById('f-sleep').value,
      nutrition: document.getElementById('f-nutrition').value,
      stress: document.getElementById('f-stress').value
    };

    const plan = generateConcurrentProgram(formData);
    state.generatedPlan = plan;
    saveState();

    renderSchedule();
    switchTab('active-plan');
  });
}

function initWeekSelector() {
  const container = document.getElementById('week-selector-container');
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('week-btn')) {
      document.querySelectorAll('.week-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.selectedWeek = parseInt(e.target.getAttribute('data-week'));
      renderScheduleWeek();
    }
  });
}

function renderSchedule() {
  if (!state.generatedPlan) return;
  document.getElementById('plan-principles-text').innerHTML = state.generatedPlan.rationale;
  renderScheduleWeek();
}

function renderScheduleWeek() {
  const container = document.getElementById('generated-schedule-content');
  if (!state.generatedPlan) {
    container.innerHTML = `<p style="color:#94a3b8;">Inget schema genererat ännu. Fyll i formuläret under "Skapa Schema".</p>`;
    return;
  }

  const weekData = state.generatedPlan.weeks.find(w => w.weekNumber === state.selectedWeek);
  if (!weekData) return;

  let html = `
    <div style="margin-bottom: 16px;">
      <h3>${weekData.title}</h3>
      <p style="color: #94a3b8; font-size: 0.9rem;">${weekData.description} — <strong>Intensitet:${weekData.intensityNote}</strong></p>
    </div>
  `;

  weekData.days.forEach(day => {
    html += `
      <div class="day-card">
        <div class="day-header">
          <div>
            <div class="day-title">${day.day}:${day.title}</div>
            <div class="timing-tag">${day.timing}</div>
          </div>
        </div>
    `;

    day.sessions.forEach(sess => {
      html += `
        <div style="margin-top: 10px;">
          <h4 style="color: ${sess.type === 'Löpning' ? '#10b981' : '#06b6d4'}; font-size: 1rem; margin-bottom: 6px;">
            ${sess.type === 'Löpning' ? '🏃 ' : '🏋️ '}${sess.name}
          </h4>
      `;

      if (sess.type === 'Löpning') {
        html += `<p style="font-family: var(--font-mono); font-size: 0.85rem; color: #cbd5e1;">${sess.protocol}</p>`;
      } else if (sess.exercises) {
        html += `
          <table class="exercise-table">
            <thead>
              <tr>
                <th>Övning</th>
                <th>Set x Reps</th>
                <th>Målintensitet</th>
                <th>Vila</th>
              </tr>
            </thead>
            <tbody>
        `;
        sess.exercises.forEach(ex => {
          html += `
            <tr>
              <td><strong>${ex.name}</strong></td>
              <td>${ex.sets}</td>
              <td><span style="color: #f59e0b;">${ex.rir}</span></td>
              <td>${ex.rest}</td>
            </tr>
          `;
        });
        html += `</tbody></table>`;
      }
      html += `</div>`;
    });

    html += `
        <div class="interference-notice">
          🛡️ <strong>Interferenshantering:</strong> ${day.interferenceRule}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Garmin Integration Simulation
function initGarminMock() {
  const syncBtn = document.getElementById('btn-sync-garmin');
  syncBtn.addEventListener('click', () => {
    syncBtn.innerHTML = "⏳ Hämtar Garmin FIT-aktiviteter...";
    syncBtn.disabled = true;

    setTimeout(() => {
      const mockGarminWorkout = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: "Löpning",
        title: "Garmin Forerunner 265: Morgonintervaller",
        metric: "6.2 km",
        duration: 34,
        notes: "Snittpuls: 158 bpm | Kadens: 178 spm | Träningseffekt: 3.4 Aerob, 1.2 Anaerob"
      };

      state.workouts.unshift(mockGarminWorkout);
      state.user.xp += 120;
      checkLevelUp();

      document.getElementById('garmin-sync-time').textContent = `Idag ${new Date().toLocaleTimeString().slice(0,5)}`;
      document.getElementById('dash-garmin-status').textContent = "Synkad nyss";
      
      syncBtn.innerHTML = "✅ Synkning klar!";
      setTimeout(() => {
        syncBtn.innerHTML = "🔄 Synka Garmin Klocka";
        syncBtn.disabled = false;
      }, 2000);

      saveState();
      renderRecentLogs();
      renderDashboard();
    }, 1200);
  });
}

// Workout Logger
function initWorkoutLogger() {
  const form = document.getElementById('manual-log-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('log-type').value;
    const title = document.getElementById('log-title').value;
    const metricVal = document.getElementById('log-metric').value;
    const duration = document.getElementById('log-duration').value;
    const notes = document.getElementById('log-notes').value;

    const metric = type.includes('Löpning') ? `${metricVal} km` : `${metricVal} kg`;

    const newLog = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type,
      title,
      metric,
      duration,
      notes
    };

    state.workouts.unshift(newLog);
    state.user.xp += 100;
    checkLevelUp();

    form.reset();
    saveState();
    renderRecentLogs();
    renderDashboard();
  });

  renderRecentLogs();
}

function renderRecentLogs() {
  const list = document.getElementById('recent-logs-list');
  list.innerHTML = '';

  state.workouts.slice(0, 5).forEach(w => {
    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `
      <div>
        <strong>${w.title}</strong>
        <div style="font-size:0.8rem; color: #94a3b8;">${w.date} • ${w.type} •${w.duration} min</div>
        <div style="font-size:0.75rem; color: #64748b;">${w.notes}</div>
      </div>
      <div style="font-family: var(--font-mono); font-weight:700; color: #06b6d4;">${w.metric}</div>
    `;
    list.appendChild(item);
  });
}

// Gamification & Avatar
function initGamification() {
  const completeChallengeBtn = document.getElementById('btn-complete-challenge');
  completeChallengeBtn.addEventListener('click', () => {
    state.user.xp += 150;
    checkLevelUp();
    completeChallengeBtn.disabled = true;
    completeChallengeBtn.textContent = "✅ Slutförd idag (+150 XP)";
    saveState();
    renderDashboard();
  });

  // Color picker
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      state.user.color = dot.getAttribute('data-color');
      updateAvatarVisual();
    });
  });

  // Archetype
  document.getElementById('av-select-archetype').addEventListener('change', (e) => {
    state.user.archetype = e.target.value;
    document.getElementById('av-archetype-tag').textContent = e.target.value;
  });

  document.getElementById('btn-save-avatar').addEventListener('click', () => {
    saveState();
    alert('Avatar uppdaterad och sparad!');
  });

  document.getElementById('btn-challenge-friend').addEventListener('click', () => {
    const friend = prompt("Vem vill du utmana? (T.ex. Marcus, Elin, Tony):", "Marcus 'Oxen'");
    if (friend) {
      alert(`Utmaning skickad till ${friend}: 'Vem loggar flest kilometer i Zon 2 denna vecka?'`);
    }
  });

  renderLeaderboard();
  updateAvatarVisual();
}

function updateAvatarVisual() {
  const box = document.getElementById('avatar-render-box');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  box.style.borderColor = state.user.color;
  box.style.boxShadow = `0 0 25px ${state.user.color}40`;
  sidebarAvatar.style.borderColor = state.user.color;
}

function checkLevelUp() {
  const requiredXp = state.user.level * 500;
  if (state.user.xp >= requiredXp) {
    state.user.level++;
    alert(`🎉 Level Up! Du nådde Nivå ${state.user.level}! Nya avatar-emblem upplåsta.`);
  }
}

function renderLeaderboard() {
  const tbody = document.getElementById('leaderboard-body');
  tbody.innerHTML = '';

  state.leaderboard.forEach(player => {
    const tr = document.createElement('tr');
    if (player.isMe) tr.className = 'leaderboard-row-me';
    tr.innerHTML = `
      <td>#${player.rank}</td>
      <td>${player.name}</td>
      <td>Nivå ${player.level}</td>
      <td>${player.weeklyVol}</td>
      <td style="font-family: var(--font-mono); font-weight:700;">${player.points} XP</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDashboard() {
  document.getElementById('sidebar-name').textContent = state.user.name;
  document.getElementById('sidebar-level').textContent = state.user.level;
  document.getElementById('sidebar-xp').textContent = state.user.xp;
}

// Canvas-based Simple Analytics Charts
function renderAnalyticsCharts() {
  drawBarChart('runningChart', [16.5, 18.0, 21.0, 22.5, 20.0, 24.5], ['V44', 'V45', 'V46', 'V47', 'V48', 'Denna v.'], '#10b981', 'km');
  drawBarChart('strengthChart', [19.5, 21.0, 22.8, 24.1, 23.5, 25.0], ['V44', 'V45', 'V46', 'V47', 'V48', 'Denna v.'], '#06b6d4', 'Ton');
}

function drawBarChart(canvasId, data, labels, color, unit) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = canvas.parentElement.clientWidth - 48;
  canvas.height = 200;

  const w = canvas.width;
  const h = canvas.height;
  const maxVal = Math.max(...data) * 1.25;

  ctx.clearRect(0, 0, w, h);

  const barWidth = (w - 60) / data.length;
  const chartHeight = h - 40;

  data.forEach((val, i) => {
    const barHeight = (val / maxVal) * chartHeight;
    const x = 40 + i * barWidth + 8;
    const y = h - 25 - barHeight;

    // Draw Bar
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth - 16, barHeight, [4, 4, 0, 0]);
    ctx.fill();

    // Value text
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${val}${unit}`, x + (barWidth - 16) / 2, y - 6);

    // Label text
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(labels[i], x + (barWidth - 16) / 2, h - 8);
  });
}

// LocalStorage persistence
function saveState() {
  localStorage.setItem('hybrid_os_state', JSON.stringify({
    user: state.user,
    workouts: state.workouts,
    generatedPlan: state.generatedPlan
  }));
}

function loadSavedState() {
  const saved = localStorage.getItem('hybrid_os_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.user) state.user = parsed.user;
      if (parsed.workouts) state.workouts = parsed.workouts;
      if (parsed.generatedPlan) {
        state.generatedPlan = parsed.generatedPlan;
        renderSchedule();
      }
    } catch (e) {
      console.error("Kunde inte läsa sparad data", e);
    }
  }
}