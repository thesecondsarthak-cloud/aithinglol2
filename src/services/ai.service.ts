import { UserInput, AnalysisResult, CareerRecommendation } from '../types/career';

export class AIService {
  private defaultApiKey: string;
  private apiEndpoint: string;

  constructor(apiKey?: string) {
    this.defaultApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async analyzeCareerPath(input: UserInput, apiKey?: string): Promise<AnalysisResult> {
    const key = apiKey || this.defaultApiKey;

    if (!key) {
      return this.getMockResponse(input);
    }

    try {
      const prompt = this.constructPrompt(input);

      const response = await fetch(`${this.apiEndpoint}?key=${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const data = await response.json();
      const text = data.candidates[0]?.content?.parts[0]?.text || '';

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getMockResponse(input);
    }
  }

  async askCareerQuestion(question: string, careerContext: string, apiKey?: string): Promise<string> {
    const key = apiKey || this.defaultApiKey;

    if (!key) {
      return this.getMockAnswerResponse(question);
    }

    try {
      const prompt = `You are an expert career counselor. Answer this question about the career: ${careerContext}

Question: ${question}

Provide a clear, detailed answer covering relevant information like:
- Required tests/examinations
- Educational qualifications needed
- Key subjects to focus on
- Skills development path
- Industry insights
- Salary expectations
- Career progression

Be specific and actionable in your response.`;

      const response = await fetch(`${this.apiEndpoint}?key=${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error('AI question failed');
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getMockAnswerResponse(question);
    }
  }

  private getMockAnswerResponse(question: string): string {
    return `Based on your question about "${question}", I recommend researching specific educational requirements, certification exams, and skill development paths for this career. Industry associations and professional organizations typically provide detailed guidance on entry requirements and career progression.`;
  }

  private constructPrompt(input: UserInput): string {
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

User Interests: ${input.interests.join(', ')}
User Skills: ${input.skills.join(', ')}

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

  private parseAIResponse(text: string): AnalysisResult {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    } catch (error) {
      console.error('Parse error:', error);
    }

    return this.getDefaultResponse();
  }

  private getMockResponse(input: UserInput): AnalysisResult {
    const allInterests = input.interests.map(i => i.toLowerCase()).join(' ');
    const allSkills = input.skills.map(s => s.toLowerCase()).join(' ');
    const combined = `${allInterests} ${allSkills}`;

    const careerDatabase = [
      { title: 'Cardiothoracic Surgeon', description: 'Perform complex heart and lung surgeries', matchKeywords: ['medicine', 'surgery', 'biology', 'health', 'anatomy', 'precision', 'mechanical'], growthPotential: 'High stakes specialty with danger pay and premium compensation', skills: ['Surgical Precision', 'Medical Knowledge', 'Decision Making', 'Physical Stamina', 'Stress Management'] },
      { title: 'Neurosurgeon', description: 'Perform delicate brain and nervous system surgeries', matchKeywords: ['medicine', 'surgery', 'biology', 'brain', 'precision', 'science'], growthPotential: 'Elite specialty with extremely high compensation', skills: ['Surgical Precision', 'Neurological Knowledge', 'Patience', 'Manual Dexterity', 'Critical Thinking'] },
      { title: 'Radiologist', description: 'Analyze X-rays, MRIs, and CT scans to diagnose medical conditions', matchKeywords: ['pattern', 'analysis', 'visual', 'medicine', 'diagnostic', 'detail', 'technology'], growthPotential: 'High demand with excellent work-life balance and compensation', skills: ['Pattern Recognition', 'Medical Imaging', 'Diagnostic Skills', 'Attention to Detail', 'Technology Proficiency'] },
      { title: 'Actuary', description: 'Calculate financial risks using mathematics and statistics', matchKeywords: ['math', 'statistics', 'analysis', 'probability', 'numbers', 'finance', 'logic'], growthPotential: 'Exam premiums and bonuses, top earners exceed $250k', skills: ['Advanced Mathematics', 'Statistical Analysis', 'Risk Assessment', 'Programming', 'Business Acumen'] },
      { title: 'Quantitative Analyst', description: 'Develop algorithmic trading strategies using math and programming', matchKeywords: ['math', 'coding', 'programming', 'finance', 'algorithm', 'analysis', 'computer'], growthPotential: 'Performance bonuses can exceed base salary, total comp $200k-500k+', skills: ['Python/C++', 'Mathematics', 'Financial Modeling', 'Algorithm Design', 'Statistical Analysis'] },
      { title: 'Petroleum Engineer', description: 'Design and optimize oil and gas extraction systems', matchKeywords: ['engineering', 'geology', 'physics', 'mechanical', 'science', 'energy', 'environment'], growthPotential: 'High pay with location premiums and bonuses, $150k-300k', skills: ['Reservoir Engineering', 'Fluid Dynamics', 'Geology', 'Project Management', 'Technical Analysis'] },
      { title: 'Nuclear Engineer', description: 'Design nuclear reactors and radiation equipment', matchKeywords: ['physics', 'engineering', 'science', 'energy', 'math', 'technology', 'environment'], growthPotential: 'Security clearance premium and specialized expertise, $120k-200k', skills: ['Nuclear Physics', 'Thermodynamics', 'Safety Protocols', 'Technical Design', 'Problem Solving'] },
      { title: 'VLSI Engineer', description: 'Design microchips and integrated circuits at nanometer scale', matchKeywords: ['electronics', 'engineering', 'technology', 'computer', 'design', 'hardware', 'physics'], growthPotential: 'High demand in semiconductor industry, $130k-250k', skills: ['Circuit Design', 'Semiconductor Physics', 'CAD Tools', 'Digital Logic', 'Problem Solving'] },
      { title: 'Site Reliability Engineer', description: 'Ensure system uptime and automate infrastructure', matchKeywords: ['programming', 'computer', 'automation', 'technology', 'coding', 'systems', 'problem'], growthPotential: 'High demand with on-call pay, $150k-300k at top companies', skills: ['Linux/Unix', 'Automation', 'Cloud Platforms', 'Programming', 'Incident Management'] },
      { title: 'Ethical Hacker', description: 'Test security by finding vulnerabilities in systems', matchKeywords: ['security', 'computer', 'technology', 'programming', 'puzzle', 'problem', 'analysis'], growthPotential: 'High demand with consulting premiums, $100k-250k', skills: ['Penetration Testing', 'Network Security', 'Programming', 'Problem Solving', 'Communication'] },
      { title: 'Patent Attorney', description: 'Protect inventions through intellectual property law', matchKeywords: ['law', 'writing', 'technology', 'analysis', 'science', 'communication', 'detail'], growthPotential: 'Technical+legal expertise premium, $150k-300k', skills: ['Patent Law', 'Technical Writing', 'Science/Engineering Background', 'Negotiation', 'Research'] },
      { title: 'Forensic Accountant', description: 'Investigate financial crimes and fraud', matchKeywords: ['accounting', 'finance', 'analysis', 'investigation', 'math', 'puzzle', 'detail'], growthPotential: 'Specialized expertise with litigation premiums, $80k-180k', skills: ['Accounting', 'Data Analysis', 'Investigation', 'Attention to Detail', 'Communication'] },
      { title: 'Air Traffic Controller', description: 'Direct aircraft traffic to ensure safe takeoffs and landings', matchKeywords: ['aviation', 'coordination', 'communication', 'spatial', 'pressure', 'multitask', 'focus'], growthPotential: 'Stress pay with excellent benefits, $100k-180k', skills: ['Spatial Awareness', 'Quick Decision Making', 'Communication', 'Stress Management', 'Focus'] },
      { title: 'Bioprocess Engineer', description: 'Design systems for lab-grown meat, vaccines, and biologics', matchKeywords: ['biology', 'engineering', 'science', 'chemistry', 'research', 'technology', 'environment'], growthPotential: 'Growing biotech industry, $90k-160k', skills: ['Bioprocessing', 'Chemical Engineering', 'Cell Culture', 'Process Optimization', 'Research'] },
      { title: 'Game Economy Designer', description: 'Design in-game economic systems and virtual markets', matchKeywords: ['gaming', 'economics', 'analysis', 'design', 'psychology', 'math', 'creative'], growthPotential: 'Niche role at top studios, $100k-200k', skills: ['Game Design', 'Economics', 'Data Analysis', 'Psychology', 'Systems Thinking'] },
    ];

    const scoredCareers = careerDatabase.map(career => {
      let score = 0;
      career.matchKeywords.forEach(keyword => {
        if (combined.includes(keyword)) score += 2;
      });

      input.interests.forEach(interest => {
        if (career.description.toLowerCase().includes(interest.toLowerCase())) score += 1;
      });

      return { ...career, score };
    });

    scoredCareers.sort((a, b) => b.score - a.score);

    const topCareers = scoredCareers.slice(0, 5);

    const recommendations: CareerRecommendation[] = topCareers.map(career => ({
      title: career.title,
      description: career.description,
      matchReason: `Your interests in ${input.interests.slice(0, 2).join(' and ')} combined with your ${input.skills.slice(0, 2).join(' and ')} skills make you well-suited for this specialized field.`,
      growthPotential: career.growthPotential,
      requiredSkills: career.skills
    }));

    return {
      summary: `Based on your unique combination of interests (${input.interests.join(', ')}) and skills (${input.skills.join(', ')}), we've identified high-paying careers that leverage your strengths. These are often overlooked but offer exceptional compensation.`,
      recommendations
    };
  }

  private getDefaultResponse(): AnalysisResult {
    return {
      summary: 'We\'ve analyzed your profile and identified several promising career paths.',
      recommendations: []
    };
  }
}

export const aiService = new AIService();
