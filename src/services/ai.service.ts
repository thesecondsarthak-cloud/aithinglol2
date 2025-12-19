import { UserInput, AnalysisResult, CareerRecommendation } from '../types/career';

export class AIService {
  private edgeFunctionUrl: string;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.edgeFunctionUrl = `${supabaseUrl}/functions/v1/career-analysis`;
  }

  async analyzeCareerPath(input: UserInput): Promise<AnalysisResult> {
    try {
      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          interests: input.interests,
          skills: input.skills,
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      return data as AnalysisResult;
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getMockResponse(input);
    }
  }

  async askCareerQuestion(question: string, careerContext: string): Promise<string> {
    return this.getMockAnswerResponse(question, careerContext);
  }

  private getMockAnswerResponse(question: string, careerContext: string): string {
    const responses: Record<string, string> = {
      'tests': `For a career in ${careerContext}, you typically need to pass specialized certification exams. Research industry-specific certifications, prepare with study materials, and consider getting mentored by professionals in the field. Timeline usually ranges from 6 months to 2 years depending on the role.`,
      'subjects': `Key subjects for ${careerContext} usually include advanced mathematics, physics, computer science, or domain-specific knowledge. Focus on building strong fundamentals in core subjects first, then specialize. Many careers also require continuous learning and staying updated with industry trends.`,
      'education': `${careerContext} typically requires at least a bachelor's degree, with many roles requiring advanced degrees (Masters/PhD). Some specialized certifications are also important. Consider internships and practical experience alongside formal education to stand out.`,
      'salary': `Salaries for ${careerContext} vary by experience, location, and specialization. Entry-level positions typically start at competitive rates, with significant growth potential. Senior professionals in this field often earn well above average, with additional bonuses and benefits.`,
      'skills': `Essential skills for ${careerContext} include technical expertise in your domain, problem-solving abilities, and communication skills. Develop both hard technical skills and soft skills like leadership and teamwork. Continuous learning is crucial in most high-paying careers.`,
      'progression': `Career progression in ${careerContext} typically involves starting as a junior professional, moving to mid-level specialist roles, and potentially reaching senior management or specialized expert positions. Networking, continuous education, and demonstrating expertise are key to advancement.`
    };

    const questionLower = question.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (questionLower.includes(key)) {
        return response;
      }
    }

    return `Based on your question about "${question}", I recommend researching specific requirements for ${careerContext}. Industry associations, professional organizations, and online resources typically provide detailed guidance on entry requirements, certifications, and career progression paths.`;
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
