/**
 * Concurrent Training Engine
 * Fysiologisk schemagenerator baserad på principer om signalvägsseparation (mTOR vs AMPK),
 * residual trötthet och volymprogression.
 */

function generateConcurrentProgram(formData) {
  const isPPL = formData.split === 'PPL';
  const hasDoubles = formData.doubleSessions && formData.doubleSessions.startsWith('Ja');

  // Fysiologisk motivering anpassad efter prioriteter
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
          protocol: `Pulszon: Zon 2 (130-142 bpm) | Fart: 5:40-6:00 min/km | Tid: ca ${isDeload ? '24' : '32'} min`
        },
        {
          type: "Gym",
          name: "Push — Bröst, Axlar & Triceps",
          exercises: [
            { name: "Bänkpress med skivstång", sets: `${setsBase} x 6-8`, rir: isDeload ? "RIR 3" : "RIR 2", rest: "2.5 min" },
            { name: "Lutande hantelpress", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "2 min" },
            { name: "Militärpress / Stående axelpress", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "90 sek" },
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
            { name: "Skivstångsrodd (Pendlay eller 45-graders)", sets: `${setsBase} x 6-8`, rir: "RIR 2", rest: "2 min" },
            { name: "Breda latsdrag", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "90 sek" },
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
      interferenceRule: "Minst 36 timmar till nästa kvalitetslöpning. Benstyrka förläggs här för att skydda hälsenor och knän.",
      sessions: [
        {
          type: "Gym",
          name: "Legs — Knäböj, Hamstrings & Vadstyrka",
          exercises: [
            { name: "Knäböj (Back Squat)", sets: isDeload ? "2 x 5" : "3-4 x 6-8", rir: "RIR 2", rest: "3 min" },
            { name: "Rumänska marklyft (RDL)", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "2 min" },
            { name: "Benspark i maskin", sets: "3 x 10-12", rir: "RIR 1-2", rest: "90 sek" },
            { name: "Stående vadpress (Akillessenaprevention)", sets: "4 x 12-15", rir: "RIR 1 (kontrollerad excentrisk)", rest: "60 sek" },
            { name: "Hängande benlyft", sets: "3 x 10-12", rir: "RIR 2", rest: "60 sek" }
          ]
        }
      ]
    },
    {
      day: "Fredag",
      title: "Aktiv Återhämtning / Lätt Morgonjogg Zon 1-2",
      timing: "Morgon kl 07:00",
      interferenceRule: "Spola ur metaboliter från bendagen utan att skapa ny muskelskada. Endast mjukt tempo.",
      sessions: [
        {
          type: "Löpning",
          name: "Flush Run & Mobilitet",
          protocol: `Distans: ${isDeload ? '3.5 km' : '4.5 km'} i lugn Zon 1-2 (<135 bpm). Avsluta med dynamisk rörlighet för höftböjare.`
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
            { name: "Dips (Kroppsvikt eller viktbälte)", sets: `${setsBase} x 8-10`, rir: "RIR 2", rest: "2 min" },
            { name: "Hantelrodd på bänk", sets: `${setsBase} x 10-12`, rir: "RIR 1-2", rest: "90 sek" },
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
          name: `Zon 2 Long Run (${isDeload ? '6.0 km' : '8.5-10.0 km'})`,
          protocol: "Prattempo (Zon 2, 132-144 bpm). Inga spurter. Fokus på kadens runt 172-180 steg/min."
        }
      ]
    }
  ];
}