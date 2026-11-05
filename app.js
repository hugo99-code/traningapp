/**
 * HybridOS - Application Logic & State Management
 * Hanterar gränssnitt, sparad data, Garmin-synk och visualisering.
 */

// Global app-state
const state = {
  activeTab: 'dashboard',
  selectedWeek: 1,
  user: {
    name: "Hybrid Athlete",
    level: 4,
    xp: 1420,
    archetype: "Hybrid Engine",
    color: "#10b981",
    avatarIcon: "⚡"
  },
  workouts: [
    { id: 1, date: "2026-11-04", type: "Löpning", title: "Morgonjogg Zon 2", metric: "5.5 km", duration: 31, notes: "Zon 2, puls 136 bpm, Garmin sync" },
    { id: 2, date: "2026-11-04", type: "Gym - Pull", title: "Pull & Explosiva Chins", metric: "6 400 kg", duration: 65, notes: "Explosiva chins med +15kg bälte" },
    { id: 3, date: "2026-11-02", type: "Gym - Push", title: "Push Tung Bänk", metric: "8 200 kg", duration: 70, notes: "Bänk 100kg 3x5" }
  ],
  leaderboard: [
    { rank: 1, name: "Marcus 'Oxen'", level: 6, weeklyVol: "28 km / 32t", points: 3450 },
    { rank: 2, name: "Hybrid Athlete (Du)", level: 4, weeklyVol: "22 km / 24t", points: 2970, isMe: true },
    { rank: 3, name: "Elin K.", level: 4, weeklyVol: "35 km / 14t", points: 2840 },
    { rank: 4, name: "Johan S.", level: 3, weeklyVol: "15 km / 26t", points: 2210 }
  ],
  generatedPlan: null
};

// Körs när DOM har laddats
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  initNavigation();
  initCoachForm();
  initWeekSelector();
  initWorkoutLogger();
  initGarminMock();
  initGamification();
  renderDashboard();
  renderRecentLogs();
  renderLeaderboard();
  updateAvatarVisual();
  renderAnalyticsCharts();
});

/* ==========================================================================
   1. NAVIGATION MELLAN FLIKAR
   ========================================================================== */
function initNavigation() {
  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;

  // Uppdatera sidomeny
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Visa rätt vy
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.toggle('active', view.id === `tab-${tabId}`);
  });

  // Rita om grafer om användaren går till Analytics
  if (tabId === 'analytics') {
    setTimeout(renderAnalyticsCharts, 50);
  }
}

/* ==========================================================================
   2. SCHEMAGENERATOR & FORMULÄRHANTERING
   ========================================================================== */
function initCoachForm() {
  const btnGen = document.getElementById('btn-generate-plan');
  if (!btnGen) return;

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

    // Anropar motorn från generator.js
    if (typeof generateConcurrentProgram === 'function') {
      const plan = generateConcurrentProgram(formData);
      state.generatedPlan = plan;
      state.user.xp += 200; // Ge XP för att ha skapat ett schema
      checkLevelUp();
      saveState();

      renderSchedule();
      switchTab('active-plan');
    } else {
      console.error("generator.js är inte laddad i rätt ordning.");
    }
  });
}

function initWeekSelector() {
  const container = document.getElementById('week-selector-container');
  if (!container) return;

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('week-btn')) {
      document.querySelectorAll('.week-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.selectedWeek = parseInt(e.target.getAttribute('data-week'), 10);
      renderScheduleWeek();
    }
  });
}

function renderSchedule() {
  if (!state.generatedPlan) return;
  const rationaleBox = document.getElementById('plan-principles-text');
  if (rationaleBox) {
    rationaleBox.innerHTML = state.generatedPlan.rationale;
  }
  renderScheduleWeek();
}

function renderScheduleWeek() {
  const container = document.getElementById('generated-schedule-content');
  if (!container) return;

  if (!state.generatedPlan) {
    container.innerHTML = `
      <div style="padding: 24px; text-align: center; color: #94a3b8; background: #131b2e; border-radius: 12px;">
        Inget schema genererat ännu. Gå till fliken <strong>"Skapa Schema"</strong> och tryck på Generera.
      </div>`;
    return;
  }

  const weekData = state.generatedPlan.weeks.find(w => w.weekNumber === state.selectedWeek);
  if (!weekData) return;

  let html = `
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 1.25rem; font-weight: 700;">${weekData.title}</h3>
      <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 4px;">
        ${weekData.description} — <strong style="color: #06b6d4;">Intensitet: ${weekData.intensityNote}</strong>
      </p>
    </div>
  `;

  weekData.days.forEach(day => {
    html += `
      <div class="day-card">
        <div class="day-header">
          <div class="day-title">${day.day}: ${day.title}</div>
          <div class="timing-tag">${day.timing}</div>
        </div>
    `;

    day.sessions.forEach(sess => {
      html += `
        <div style="margin-top: 14px;">
          <h4 style="color: ${sess.type === 'Löpning' ? '#10b981' : '#06b6d4'}; font-size: 0.95rem; margin-bottom: 8px;">
            ${sess.type === 'Löpning' ? '🏃 ' : '🏋️ '}${sess.name}
          </h4>
      `;

      if (sess.type === 'Löpning') {
        html += `<p style="font-family: var(--font-mono); font-size: 0.85rem; color: #cbd5e1; background: #0b1120; padding: 10px; border-radius: 6px;">${sess.protocol}</p>`;
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
              <td><span style="color: #f59e0b; font-weight:600;">${ex.rir}</span></td>
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

/* ==========================================================================
   3. GARMIN HEALTH / FIT API SIMULERING
   ========================================================================== */
function initGarminMock() {
  const syncBtn = document.getElementById('btn-sync-garmin');
  if (!syncBtn) return;

  syncBtn.addEventListener('click', () => {
    syncBtn.innerHTML = "⏳ Hämtar Garmin FIT-data...";
    syncBtn.disabled = true;

    setTimeout(() => {
      const now = new Date();
      const mockGarminWorkout = {
        id: Date.now(),
        date: now.toISOString().split('T')[0],
        type: "Löpning",
        title: "Garmin Forerunner: Morgonpass Tröskel",
        metric: "5.8 km",
        duration: 29,
        notes: "Snittpuls: 154 bpm | Kadens: 178 spm | Aerob TE: 3.4"
      };

      state.workouts.unshift(mockGarminWorkout);
      state.user.xp += 150;
      checkLevelUp();

      const syncLabel = document.getElementById('garmin-sync-time');
      if (syncLabel) syncLabel.textContent = `Idag ${now.toLocaleTimeString().slice(0, 5)}`;
      
      const dashStatus = document.getElementById('dash-garmin-status');
      if (dashStatus) dashStatus.textContent = "Synkad nyss";

      syncBtn.innerHTML = "✅ Synkning klar!";
      setTimeout(() => {
        syncBtn.innerHTML = "🔄 Synka Garmin Klocka";
        syncBtn.disabled = false;
      }, 2500);

      saveState();
      renderRecentLogs();
      renderDashboard();
    }, 1200);
  });
}

/* ==========================================================================
   4. MANUELL TRÄNINGSLOGG
   ========================================================================== */
function initWorkoutLogger() {
  const form = document.getElementById('manual-log-form');
  if (!form) return;

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
      duration: parseInt(duration, 10),
      notes: notes || "Inga specifika anteckningar"
    };

    state.workouts.unshift(newLog);
    state.user.xp += 100;
    checkLevelUp();

    form.reset();
    saveState();
    renderRecentLogs();
    renderDashboard();
  });
}

function renderRecentLogs() {
  const list = document.getElementById('recent-logs-list');
  if (!list) return;
  list.innerHTML = '';

  state.workouts.slice(0, 5).forEach(w => {
    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `
      <div>
        <strong>${w.title}</strong>
        <div style="font-size:0.8rem; color: #94a3b8;">${w.date} • ${w.type} • ${w.duration} min</div>
        <div style="font-size:0.75rem; color: #64748b; margin-top:2px;">${w.notes}</div>
      </div>
      <div style="font-family: var(--font-mono); font-weight:700; color: #06b6d4;">${w.metric}</div>
    `;
    list.appendChild(item);
  });
}

/* ==========================================================================
   5. GAMIFICATION, AVATAR & TOPPLISTA
   ========================================================================== */
function initGamification() {
  const completeChallengeBtn = document.getElementById('btn-complete-challenge');
  if (completeChallengeBtn) {
    completeChallengeBtn.addEventListener('click', () => {
      state.user.xp += 150;
      checkLevelUp();
      completeChallengeBtn.disabled = true;
      completeChallengeBtn.textContent = "✅ Slutförd idag (+150 XP)";
      saveState();
      renderDashboard();
    });
  }

  // Färgval för avatar
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      state.user.color = dot.getAttribute('data-color');
      updateAvatarVisual();
    });
  });

  // Archetype selector
  const archetypeSelect = document.getElementById('av-select-archetype');
  if (archetypeSelect) {
    archetypeSelect.addEventListener('change', (e) => {
      state.user.archetype = e.target.value;
      const badge = document.getElementById('av-archetype-tag');
      if (badge) badge.textContent = e.target.value;
    });
  }

  // Spara avatar
  const saveAvatarBtn = document.getElementById('btn-save-avatar');
  if (saveAvatarBtn) {
    saveAvatarBtn.addEventListener('click', () => {
      saveState();
      alert('Avatar och atlet-profil har sparats!');
    });
  }

  // Utmana vän
  const challengeBtn = document.getElementById('btn-challenge-friend');
  if (challengeBtn) {
    challengeBtn.addEventListener('click', () => {
      const friend = prompt("Vem vill du utmana? (T.ex. Marcus, Elin, Johan):", "Marcus 'Oxen'");
      if (friend) {
        alert(`Utmaning skickad till ${friend}: 'Flest antal loggade Zon 2-kilometer denna vecka!'`);
      }
    });
  }
}

function updateAvatarVisual() {
  const box = document.getElementById('avatar-render-box');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  if (box) {
    box.style.borderColor = state.user.color;
    box.style.boxShadow = `0 0 25px ${state.user.color}40`;
  }
  if (sidebarAvatar) {
    sidebarAvatar.style.borderColor = state.user.color;
  }
}

function checkLevelUp() {
  const requiredXp = state.user.level * 500;
  if (state.user.xp >= requiredXp) {
    state.user.level++;
    alert(`🎉 Level Up! Du nådde Nivå ${state.user.level}! Fortsätt hålla balansen mellan löpning och styrka.`);
  }
}

function renderLeaderboard() {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;
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
  const nameEl = document.getElementById('sidebar-name');
  const levelEl = document.getElementById('sidebar-level');
  const xpEl = document.getElementById('sidebar-xp');

  if (nameEl) nameEl.textContent = state.user.name;
  if (levelEl) levelEl.textContent = state.user.level;
  if (xpEl) xpEl.textContent = state.user.xp;
}

/* ==========================================================================
   6. ANALYTICS & CANVAS DIAGRAM
   ========================================================================== */
function renderAnalyticsCharts() {
  drawBarChart('runningChart', [16.5, 18.0, 21.0, 22.5, 20.0, 24.5], ['V44', 'V45', 'V46', 'V47', 'V48', 'Denna v.'], '#10b981', 'km');
  drawBarChart('strengthChart', [19.5, 21.0, 22.8, 24.1, 23.5, 25.0], ['V44', 'V45', 'V46', 'V47', 'V48', 'Denna v.'], '#06b6d4', 'Ton');
}

function drawBarChart(canvasId, data, labels, color, unit) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !canvas.parentElement) return;
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
    const x = 35 + i * barWidth + 8;
    const y = h - 25 - barHeight;

    // Rita stapel
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth - 16, barHeight, [4, 4, 0, 0]);
    ctx.fill();

    // Siffra ovanför stapel
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${val} ${unit}`, x + (barWidth - 16) / 2, y - 6);

    // Etikett (Vecka) under stapel
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(labels[i], x + (barWidth - 16) / 2, h - 8);
  });
}

/* ==========================================================================
   7. LOKAL PERSISTENS (LOCALSTORAGE)
   ========================================================================== */
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
      console.error("Kunde inte läsa sparad data:", e);
    }
  }
}