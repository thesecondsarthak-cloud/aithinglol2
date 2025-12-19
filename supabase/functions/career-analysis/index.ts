import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

interface CareerRequest {
  interests: string[];
  skills: string[];
}

function constructPrompt(input: CareerRequest): string {
  const careerDatabase = `
# COMPREHENSIVE HIDDEN CAREER DATABASE

### 1. ADRENALINE & PRECISION GROUP
- Cardiothoracic Surgeon (heart/lung surgery, high stakes, interests: engines/plumbing)
- Neurosurgeon (brain surgery, precision, interests: electricity/delicate puzzles)
- Orthopedic Trauma Surgeon (bone reconstruction, interests: carpentry/power tools)
- Saturation Diver (deep-sea oil rig repair, interests: deep water/solitude, danger pay)
- Air Traffic Controller (directing planes, interests: 3D puzzles/video games, stress pay)
- Merchant Navy Officer (commanding ships, interests: sea/isolation, tax-free income)

### 2. DEEP DIVE ANALYSTS
- Radiologist (X-ray/MRI diagnosis, interests: patterns/visual puzzles)
- Pathologist (tissue analysis, interests: microscopes/detective work)
- Forensic Accountant (uncovering financial crimes, interests: puzzles/justice)
- Actuary (risk calculation, interests: statistics/probability, exam premiums)
- Quantitative Analyst (algorithmic trading, interests: coding/math, performance bonuses)

### 3. MACRO STRATEGY & INFLUENCE
- Economic Consultant (antitrust litigation, interests: debate/data science)
- Macro Strategist (predicting market crashes, interests: history/politics)
- Industrial-Organizational Psychologist (workforce optimization, interests: psychology/data)
- Corporate Diplomat (business-government liaison, interests: politics/negotiation)

### 4. EXTREME ENGINEERS
- Petroleum/Reservoir Engineer (oil extraction, interests: geology/physics)
- Nuclear Engineer (reactor design, interests: physics/safety, security clearance)
- Mining & Geotechnical Engineer (preventing collapses, interests: rocks/machinery)
- Aerodynamicist (vehicle aerodynamics, interests: wind/speed/F1 racing)

### 5. HIDDEN TECH ARCHITECTS
- VLSI Engineer (chip design, interests: nanometers/logic gates)
- Embedded Systems Engineer (hardware coding, interests: IoT/tinkering)
- Site Reliability Engineer (system uptime, interests: automation/crisis management)
- Ethical Hacker (penetration testing, interests: breaking rules/puzzles)

### 6. DIGITAL WORLDS, GAMING & VFX
- Physics Programmer (game engine physics, interests: calculus/linear algebra)
- FX Technical Director (movie effects, interests: fluid dynamics/destruction)
- Technical Artist (art+code bridge, interests: Python/art, unicorn role)
- Game Economy Designer (in-game economics, interests: macroeconomics/psychology)

### 7. SENSORY & BIOLOGICAL SCIENTISTS
- Bioprocess Engineer (lab-grown meat/vaccines, interests: biology/sustainability)
- Zymologist/Brewmaster (fermentation engineering, interests: microbiology/recipes)
- Flavorist/Perfumer (taste/smell creation, interests: chemistry/sensory, extremely rare)
- Industrial Designer (product shape/feel, interests: art/ergonomics)

### 8. NICHE MEDIA, LANGUAGE & ARTS
- Localization Specialist (cultural translation, interests: languages/culture)
- Colorist (film color grading, interests: photography/color theory)
- Foley Artist (sound effects creation, interests: sound/creativity)

### 9. FIXERS & NEGOTIATORS
- Insolvency Professional (bankruptcy management, interests: law/finance/conflict)
- Ship Broker (cargo-ship matching, interests: geography/trading)
- Patent Attorney (invention protection, interests: tech/precise writing)
- Chief of Staff (CEO right hand, interests: generalist/diplomacy)

### 10. LUXURY & SPECIALIZED SERVICES
- Private Estate Manager (ultra-wealthy services, interests: hospitality/logistics)
- Gemologist (precious stone certification, interests: geology/optics)
- Embalmer/Funeral Director (body preservation, interests: anatomy/chemistry)
- Horologist (luxury watch repair, interests: tiny mechanics/patience)

### 11. FINANCIAL COMMAND & CONTROL
- International Tax Specialist (cross-border tax, interests: law/finance/loopholes)
- M&A Analyst (company valuation, interests: high stakes/rapid math)
- Chief Compliance Officer (corporate compliance, interests: rules/details)
- Cost Controller (profit optimization, interests: efficiency/manufacturing)
`;

  return `You are an expert career counselor with deep knowledge of hidden, high-paying careers. Analyze the following user profile and match them to careers from the comprehensive database below.

User Interests: ${input.interests.join(", ")}
User Skills: ${input.skills.join(", ")}

${careerDatabase}

MATCHING CRITERIA:
1. Match user interests and skills to careers that align with their temperament
2. Consider both direct matches and transferable skills
3. If no perfect match exists, recommend high-paying careers that utilize their core strengths
4. Prioritize careers with hidden pay factors (danger pay, stress pay, scarcity premiums, etc.)

Provide exactly 5 career recommendations in JSON format:
{
  "summary": "A 2-3 sentence analysis explaining the career direction based on their profile",
  "recommendations": [
    {
      "title": "Exact Career Title from Database",
      "description": "What the job involves (from the database)",
      "matchReason": "Specific explanation of why their interests/skills align",
      "growthPotential": "Include the hidden pay factor if mentioned in database",
      "requiredSkills": ["3-5 specific skills needed"]
    }
  ]
}

Return ONLY valid JSON, no additional text.`;
}

async function analyzeCareer(input: CareerRequest): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  const prompt = constructPrompt(input);

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Gemini API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const text = data.candidates[0]?.content?.parts[0]?.text || "";

  if (!text) {
    throw new Error("No response from Gemini API");
  }

  return text;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const input: CareerRequest = await req.json();

    if (
      !input.interests ||
      !Array.isArray(input.interests) ||
      !input.skills ||
      !Array.isArray(input.skills)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid input format" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const analysisText = await analyzeCareer(input);

    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
