import type { LearningPath } from "~/types/learning-path";
import type { Scenario } from "~/types/scenario";

export const mockLearningPaths: LearningPath[] = [
  {
    path_id: "capital-iq-fundamentals",
    title: "S&P Capital IQ Pro Fundamentals",
    description:
      "Master the basics of S&P Capital IQ Pro platform, including navigation, company research, and financial data analysis.",
    duration_estimate_hours: 10,
    activities: [
      {
        activity_id: "platform-intro-slide",
        title: "Introduction to Capital IQ Pro",
        type: "slide",
        config: {
          title: "Getting Started with S&P Capital IQ Pro",
          content: `
            <h2 class="text-2xl font-bold mb-4 text-brand-800">What is S&P Capital IQ Pro?</h2>
            <p class="mb-4">S&P Capital IQ Pro is a comprehensive financial intelligence platform that provides data, analytics, and research on public and private companies, markets, and industries worldwide.</p>

            <h3 class="text-xl font-semibold mb-3 text-brand-700">Key Features:</h3>
            <ul class="list-disc pl-6 mb-4">
              <li class="mb-2"><strong class="font-semibold">Company Screening:</strong> Filter companies based on financial metrics and criteria</li>
              <li class="mb-2"><strong class="font-semibold">Financial Data:</strong> Access to comprehensive financial statements and ratios</li>
              <li class="mb-2"><strong class="font-semibold">Market Intelligence:</strong> Real-time market data and news</li>
              <li class="mb-2"><strong class="font-semibold">Excel Integration:</strong> Pull data directly into spreadsheets for analysis</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3 text-brand-700">Why Use Capital IQ Pro?</h3>
            <p class="mb-4">Capital IQ Pro offers unparalleled depth of financial information, making it essential for financial analysts, investment bankers, private equity professionals, and corporate strategists.</p>
          `,
        },
      },
      {
        activity_id: "navigation-quiz",
        title: "Platform Navigation Quiz",
        type: "quiz",
        config: {
          question:
            "Which section of Capital IQ Pro would you use to find comparable company analysis?",
          options: ["News & Research", "Screening & Analytics", "Markets", "Excel Plugin"],
          correct_answer: 1,
          explanation:
            "The Screening & Analytics section allows you to build company peer groups and perform comparative analysis using various financial metrics and multiples.",
        },
      },
      {
        activity_id: "platform-tutorial-video",
        title: "Capital IQ Platform Tutorial",
        type: "embed",
        config: {
          url: "https://www.youtube.com/embed/eCjqEaWZvHg?si=oTZGa3ZuRsXu77M5",
          title: "S&P Capital IQ Pro Platform Tutorial",
          description:
            "A comprehensive walkthrough of the Capital IQ Pro interface and key features",
          embed_type: "video",
        },
      },
      {
        activity_id: "financial-analysis-flashcard",
        title: "Financial Analysis Concepts",
        type: "flashcard",
        config: {
          cards: [
            {
              id: "fin-1",
              front: "What is EBITDA?",
              back: "EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It's a measure of a company's overall financial performance and is used as an alternative to net income in some circumstances.",
              tags: ["Financial Metrics", "Valuation", "Analysis"],
            },
            {
              id: "fin-2",
              front: "What is the EV/EBITDA multiple?",
              back: "Enterprise Value to EBITDA (EV/EBITDA) is a valuation ratio that compares a company's enterprise value to its earnings before interest, taxes, depreciation, and amortization. It's commonly used to determine the value of a company and compare it to similar businesses.",
              tags: ["Valuation Multiples", "Financial Analysis"],
            },
            {
              id: "fin-3",
              front: "What is a DCF model?",
              back: "Discounted Cash Flow (DCF) is a valuation method used to estimate the value of an investment based on its expected future cash flows. DCF analysis attempts to determine the value of an investment today, based on projections of how much money it will generate in the future.",
              tags: ["Valuation", "Financial Modeling"],
            },
            {
              id: "fin-4",
              front: "What is a comp table?",
              back: "A comparable company analysis (comp table) is a valuation methodology that compares the current financial metrics of similar companies to determine the relative value of a target company. Common metrics include EV/EBITDA, P/E ratio, and revenue multiples.",
              tags: ["Valuation", "Financial Analysis", "Comps"],
            },
          ],
        },
      },
      {
        activity_id: "capital-iq-features-matching",
        title: "Match Capital IQ Features to Use Cases",
        type: "matching",
        config: {
          instruction: "Connect each Capital IQ Pro feature with its primary use case.",
          pairs: [
            {
              id: "pair-1",
              left: { id: "screening", content: "Screening & Analytics", type: "text" },
              right: {
                id: "screening-use",
                content: "Find companies that match specific financial criteria",
                type: "text",
              },
            },
            {
              id: "pair-2",
              left: { id: "excel-plugin", content: "Excel Plugin", type: "text" },
              right: {
                id: "excel-use",
                content: "Pull live financial data directly into spreadsheets",
                type: "text",
              },
            },
            {
              id: "pair-3",
              left: { id: "tearsheet", content: "Company Tearsheet", type: "text" },
              right: {
                id: "tearsheet-use",
                content: "Get comprehensive overview of a single company",
                type: "text",
              },
            },
            {
              id: "pair-4",
              left: { id: "news", content: "News & Research", type: "text" },
              right: {
                id: "news-use",
                content: "Stay updated on market events and analyst reports",
                type: "text",
              },
            },
          ],
          success_message: "Great! You understand how to use Capital IQ Pro's key features.",
          layout: "two_columns",
        },
      },
      {
        activity_id: "capital-iq-terminology-blanks",
        title: "Capital IQ Pro Terminology",
        type: "fill_blanks",
        config: {
          instruction: "Complete these sentences about Capital IQ Pro features and terminology.",
          text_with_blanks:
            "A company _____ provides a one-page summary of key financial metrics and information. The _____ function allows you to filter companies based on specific criteria. _____ data shows real-time stock prices and trading volumes. The _____ plugin enables you to pull Capital IQ data directly into spreadsheets.",
          blanks: [
            {
              id: "blank-1",
              position: 1,
              correct_answers: ["Tearsheet", "Tear Sheet"],
              hint: "One-page company summary",
              feedback: "A tearsheet provides a comprehensive one-page overview of a company.",
            },
            {
              id: "blank-2",
              position: 2,
              correct_answers: ["Screening", "Screen"],
              hint: "Feature for filtering companies",
              feedback: "Screening allows you to filter companies by financial criteria.",
            },
            {
              id: "blank-3",
              position: 3,
              correct_answers: ["Market", "Trading"],
              hint: "Real-time price information",
              feedback: "Market data provides real-time pricing and trading information.",
            },
            {
              id: "blank-4",
              position: 4,
              correct_answers: ["Excel", "Office"],
              hint: "Spreadsheet integration tool",
              feedback: "The Excel plugin integrates Capital IQ data with spreadsheets.",
            },
          ],
          success_message: "Perfect! You're becoming a Capital IQ Pro expert!",
        },
      },
      {
        activity_id: "capital-iq-docs-embed",
        title: "S&P Capital IQ Pro Documentation",
        type: "embed",
        config: {
          url: "https://www.spglobal.com/marketintelligence/en/solutions/sp-capital-iq-pro",
          title: "S&P Capital IQ Pro Official Documentation",
          description:
            "Explore the official documentation to deepen your understanding of the platform",
          embed_type: "article" as const,
        },
      },
    ],
  },
  {
    path_id: "advanced-financial-modeling",
    title: "Advanced Financial Modeling with Capital IQ",
    description:
      "Learn how to build sophisticated financial models using data from S&P Capital IQ Pro and Excel integration.",
    duration_estimate_hours: 15,
    activities: [
      {
        activity_id: "excel-plugin-slide",
        title: "Capital IQ Excel Plugin Basics",
        type: "slide",
        config: {
          title: "Excel Integration with Capital IQ Pro",
          content: `
            <h2 class="text-2xl font-bold mb-4 text-green-800">Leveraging the Excel Plugin</h2>
            <p class="mb-4">The S&P Capital IQ Pro Excel Plugin allows analysts to pull financial data directly into spreadsheets for advanced modeling and analysis.</p>

            <h3 class="text-xl font-semibold mb-3 text-green-700">Key Functions:</h3>
            <ul class="list-disc pl-6 mb-4">
              <li class="mb-2"><code class="bg-gray-100 px-2 py-1 rounded">CIQ()</code> - Retrieve specific data points for companies</li>
              <li class="mb-2"><code class="bg-gray-100 px-2 py-1 rounded">CIQCF()</code> - Pull complete financial statements</li>
              <li class="mb-2"><code class="bg-gray-100 px-2 py-1 rounded">CIQINDEX()</code> - Access index and market data</li>
              <li class="mb-2"><code class="bg-gray-100 px-2 py-1 rounded">CIQTRADE()</code> - Get trading and pricing information</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3 text-green-700">Benefits of Excel Integration:</h3>
            <ol class="list-decimal pl-6 mb-4">
              <li class="mb-2">Automate data collection</li>
              <li class="mb-2">Ensure data accuracy</li>
              <li class="mb-2">Create dynamic models that update with fresh data</li>
              <li class="mb-2">Build custom templates for recurring analyses</li>
            </ol>
          `,
        },
      },
      {
        activity_id: "dcf-modeling-video",
        title: "DCF Modeling Using Capital IQ Data",
        type: "embed",
        config: {
          url: "https://www.youtube.com/embed/nyot7FkYoqM?si=_HoasUaIip3pstEF",
          title: "Building a DCF Model with Capital IQ Data",
          description:
            "Step-by-step tutorial on creating a discounted cash flow model using Capital IQ data",
          embed_type: "video",
        },
      },
      {
        activity_id: "financial-model-quiz",
        title: "Financial Modeling Quiz",
        type: "quiz",
        config: {
          question:
            "Which Excel function in Capital IQ would you use to pull a 5-year income statement for a company?",
          options: ["CIQ()", "CIQCF()", "CIQINDEX()", "CIQTRADE()"],
          correct_answer: 1,
          explanation:
            "CIQCF() is used to pull complete financial statements, including income statements, balance sheets, and cash flow statements for specified time periods.",
        },
      },
      {
        activity_id: "valuation-simulator",
        title: "Interactive Valuation Simulator",
        type: "embed",
        config: {
          url: "https://valuingtools.com/en/valuation-simulator",
          title: "Company Valuation Simulator",
          description:
            "Interactive tool to practice valuation techniques and see how changing assumptions affects company value",
          embed_type: "interactive",
        },
      },
      {
        activity_id: "financial-terminology-blanks",
        title: "Financial Terminology Fill-in-the-Blanks",
        type: "fill_blanks",
        config: {
          instruction:
            "Complete the sentences by dragging the correct financial terms into the blanks.",
          text_with_blanks:
            "The _____ represents the total market value of a company's outstanding shares. To calculate enterprise value, you add _____ to market capitalization. The _____ ratio compares a company's stock price to its earnings per share. A company's _____ margin shows how much profit it makes on each dollar of revenue.",
          blanks: [
            {
              id: "blank-1",
              position: 1,
              correct_answers: ["Market Cap", "Market Capitalization"],
              hint: "Total value of all shares",
              feedback: "Market capitalization is the total value of a company's shares.",
            },
            {
              id: "blank-2",
              position: 2,
              correct_answers: ["Net Debt", "Debt"],
              hint: "What you add to market cap for enterprise value",
              feedback: "Net debt is added to market cap to get enterprise value.",
            },
            {
              id: "blank-3",
              position: 3,
              correct_answers: ["P/E", "Price-to-Earnings"],
              hint: "Stock price divided by earnings per share",
              feedback: "P/E ratio compares stock price to earnings per share.",
            },
            {
              id: "blank-4",
              position: 4,
              correct_answers: ["Gross", "Profit"],
              hint: "Type of margin that shows profitability",
              feedback: "Gross margin shows profit as a percentage of revenue.",
            },
          ],
          success_message: "Excellent! You've mastered these key financial terms!",
        },
      },
      {
        activity_id: "valuation-metrics-matching",
        title: "Match Valuation Metrics to Definitions",
        type: "matching",
        config: {
          instruction: "Drag each valuation metric to its correct definition.",
          pairs: [
            {
              id: "pair-1",
              left: { id: "ev-ebitda", content: "EV/EBITDA", type: "text" },
              right: {
                id: "ev-ebitda-def",
                content:
                  "Enterprise value divided by earnings before interest, taxes, depreciation, and amortization",
                type: "text",
              },
            },
            {
              id: "pair-2",
              left: { id: "pe-ratio", content: "P/E Ratio", type: "text" },
              right: {
                id: "pe-ratio-def",
                content: "Stock price divided by earnings per share",
                type: "text",
              },
            },
            {
              id: "pair-3",
              left: { id: "pbv-ratio", content: "P/B Ratio", type: "text" },
              right: {
                id: "pbv-ratio-def",
                content: "Market value of equity divided by book value of equity",
                type: "text",
              },
            },
            {
              id: "pair-4",
              left: { id: "dcf", content: "DCF Valuation", type: "text" },
              right: {
                id: "dcf-def",
                content: "Present value of projected future cash flows",
                type: "text",
              },
            },
            {
              id: "pair-5",
              left: { id: "wacc", content: "WACC", type: "text" },
              right: {
                id: "wacc-def",
                content: "Weighted average cost of capital used as discount rate",
                type: "text",
              },
            },
          ],
          success_message: "Perfect! You understand how these valuation metrics work.",
          layout: "two_columns",
        },
      },
      {
        activity_id: "valuation-flashcard",
        title: "Valuation Concepts",
        type: "flashcard",
        config: {
          cards: [
            {
              id: "val-1",
              front: "What is WACC?",
              back: "WACC (Weighted Average Cost of Capital) represents a company's average cost of financing its assets, weighted according to the proportion of debt and equity in its capital structure. It's used as the discount rate in DCF valuation models.",
              tags: ["WACC", "Valuation", "DCF"],
            },
            {
              id: "val-2",
              front: "What is a LBO model?",
              back: "A Leveraged Buyout (LBO) model is a financial model used to evaluate the acquisition of a company through significant use of debt financing. The model projects cash flows to determine if the acquired company can generate sufficient returns to service the debt and provide adequate returns to equity investors.",
              tags: ["LBO", "Financial Modeling", "Private Equity"],
            },
            {
              id: "val-3",
              front: "What is a sensitivity analysis?",
              back: "Sensitivity analysis is a technique used in financial modeling to determine how different values of an independent variable affect a particular dependent variable under specific conditions. It helps assess how changes in key assumptions impact valuation outcomes.",
              tags: ["Financial Modeling", "Valuation", "Analysis"],
            },
          ],
        },
      },
    ],
  },
  {
    path_id: "market-intelligence",
    title: "Market Intelligence and Sector Analysis",
    description:
      "Learn how to leverage S&P Capital IQ Pro for comprehensive industry research, market trends, and competitive analysis.",
    duration_estimate_hours: 8,
    activities: [
      {
        activity_id: "sector-analysis-intro",
        title: "Sector Analysis Framework",
        type: "slide",
        config: {
          title: "Industry Research with Capital IQ Pro",
          content: `
            <h2 class="text-2xl font-bold mb-4 text-purple-800">Sector and Industry Analysis</h2>
            <p class="mb-4">S&P Capital IQ Pro provides powerful tools for analyzing industries, sectors, and market trends to inform investment decisions and strategic planning.</p>

            <h3 class="text-xl font-semibold mb-3 text-purple-700">Key Industry Analysis Features:</h3>
            <ul class="list-disc pl-6 mb-4">
              <li class="mb-2">Industry Primers and Reports</li>
              <li class="mb-2">Sector-Specific Metrics and KPIs</li>
              <li class="mb-2">Competitive Landscape Analysis</li>
              <li class="mb-2">Market Share Data</li>
              <li class="mb-2">Industry Growth Projections</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3 text-purple-700">Analytical Framework:</h3>
            <p class="mb-4">A comprehensive sector analysis typically includes examination of market structure, competitive dynamics, regulatory environment, growth drivers, and financial performance metrics specific to the industry.</p>
          `,
        },
      },
      {
        activity_id: "industry-analysis-interactive",
        title: "Interactive Industry Analysis Tool",
        type: "embed",
        config: {
          url: "https://valuingtools.com/en/valuation-simulator",
          title: "Industry Analysis Simulation",
          description:
            "Interactive tool to analyze different industries and their key metrics, competitive landscape, and growth trends",
          embed_type: "interactive",
        },
      },
      {
        activity_id: "analyst-interview-video",
        title: "Industry Expert Interview",
        type: "embed",
        config: {
          url: "https://www.youtube.com/embed/CUa30M_FPhk?si=phtpHJ211FPsnpce",
          title: "Interview with Senior Industry Analyst",
          description:
            "Learn how professional analysts use Capital IQ Pro for comprehensive market intelligence",
          embed_type: "video",
        },
      },
      {
        activity_id: "market-intelligence-quiz",
        title: "Market Intelligence Quiz",
        type: "quiz",
        config: {
          question:
            "Which Capital IQ Pro feature would be most useful for identifying the top 10 companies in an industry by revenue growth?",
          options: [
            "News & Research Center",
            "Company Tearsheet",
            "Screening & Analytics",
            "Transaction Screening",
          ],
          correct_answer: 2,
          explanation:
            "The Screening & Analytics feature allows you to create custom screens based on industry classification and financial metrics like revenue growth to identify top performers in a sector.",
        },
      },
    ],
  },
];

// Mock Progress Data
export const mockProgress = [
  {
    progress_id: "prog-1",
    learner_id: "current-learner-id",
    path_id: "market-intelligence",
    activity_id: "market-intelligence-quiz",
    status: "completed" as const,
    completion_percentage: 100,
    time_spent_minutes: 15,
    last_accessed: "2025-06-25T10:00:00Z",
    started_at: "2025-06-25T09:45:00Z",
    completed_at: "2025-06-25T10:00:00Z",
  },
  {
    progress_id: "prog-2",
    learner_id: "current-learner-id",
    path_id: "capital-iq-fundamentals",
    activity_id: "financial-analysis-flashcard",
    status: "in_progress" as const,
    completion_percentage: 50,
    time_spent_minutes: 8,
    last_accessed: "2025-06-25T10:15:00Z",
    started_at: "2025-06-25T10:00:00Z",
  },
];

// Mock Achievements Data
export const mockAchievements = [
  {
    achievement_id: "ach-1",
    learner_id: "current-learner-id",
    title: "First Steps",
    description: "Completed your first learning activity",
    type: "completion" as const,
    earned_at: "2025-06-25T10:00:00Z",
    points: 10,
    path_id: "intro-to-react",
  },
  {
    achievement_id: "ach-2",
    learner_id: "current-learner-id",
    title: "Quiz Master",
    description: "Answered 5 quiz questions correctly",
    type: "skill_based" as const,
    earned_at: "2025-06-25T10:15:00Z",
    points: 25,
  },
];

// Mock Scenarios
export const mockScenarios: Scenario[] = [
  {
    id: "scn-001",
    program: {
      id: "prog-001",
      user_id: "user-123",
      topic: {
        id: "topic-001",
        title: "Evaluating Enterprise Software Solutions",
        organisation: {
          id: "org-001",
          name: "TechThink Inc.",
          created_at: "2023-01-10T10:00:00Z",
        },
        metadatas: {
          prompt: "Guide clients through enterprise software evaluations.",
        },
        started_at: "2024-06-01T08:00:00Z",
      },
      assignment_prompt: "Create a decision guide for enterprise software selection.",
      metadatas: {
        day: 1,
        topics: "Evaluation, Procurement",
        exercises: "Checklist creation, client Q&A",
      },
      assignment_type: "ESSAY",
      status: "ACTIVE",
      started_at: "2024-06-01T08:00:00Z",
    },
    persona: {
      name: "Sandra Lee",
      role: "CTO",
      company_size: "500+ employees",
      pain_points: ["Legacy system limitations", "Integration complexity"],
      budget_range: "$200,000 - $500,000",
      decision_style: "Analytical",
      objections: ["Vendor lock-in", "Implementation time"],
      personality_traits: ["Detail-oriented", "Cautious", "Methodical"],
      voice: "Professional and cautious",
      background: "20 years in enterprise IT leadership",
      communication_style: "Structured and technical",
      current_challenge: "Choosing a scalable CRM system",
      specific_context: "Current system is outdated and lacks reporting features.",
      time_pressure: "High – decision needed within 2 weeks",
      emotional_state: "Cautiously optimistic",
      competitors_used: ["Salesforce", "Oracle CX"],
    },
    scenarios: [
      {
        name: "Initial Discovery Call",
        description: "You meet with Sandra to understand her priorities.",
        customer_mood: "Curious but skeptical",
        objectives: ["Understand pain points", "Identify critical success factors"],
        context: "First meeting, remote via Zoom",
        urgency: "Medium",
      },
      {
        name: "Feature Prioritization Workshop",
        description: "Collaboratively rank CRM features with Sandra and her team.",
        customer_mood: "Engaged",
        objectives: ["Build consensus", "Clarify must-haves vs nice-to-haves"],
        context: "In-person workshop",
        urgency: "High",
      },
    ],
    created_at: "2024-06-02T09:30:00Z",
  },
  {
    id: "scn-002",
    program: {
      id: "prog-002",
      user_id: "user-456",
      topic: {
        id: "topic-002",
        title: "Marketing for Early-Stage Startups",
        organisation: {
          id: "org-002",
          name: "StartupSphere",
          created_at: "2022-11-05T12:00:00Z",
        },
        metadatas: {
          prompt: "Help startup founders align marketing to early traction goals.",
        },
        started_at: "2024-06-15T10:00:00Z",
      },
      assignment_prompt: "Draft a week-1 go-to-market strategy for a SaaS startup.",
      metadatas: {
        day: 3,
        topics: "Marketing, Brand Positioning",
        exercises: "Messaging refinement, channel analysis",
      },
      assignment_type: "ESSAY",
      status: "COMPLETED",
      started_at: "2024-06-15T10:00:00Z",
    },
    persona: {
      name: "Alex Kim",
      role: "Founder & CEO",
      company_size: "10 employees",
      pain_points: ["Low awareness", "Limited budget", "No marketing team"],
      budget_range: "$10,000 - $25,000",
      decision_style: "Instinctive",
      objections: ["Too slow", "Not viral enough"],
      personality_traits: ["Visionary", "Impatient", "Energetic"],
      voice: "Fast-paced and ambitious",
      background: "Ex-Google PM turned founder",
      communication_style: "Direct and fast",
      current_challenge: "Getting first 100 paying users",
      specific_context: "Just closed pre-seed funding",
      time_pressure: "Urgent – investor update in 1 week",
      emotional_state: "Excited but overwhelmed",
      competitors_used: ["Canva", "Mailchimp"],
    },
    scenarios: [
      {
        name: "Budget Allocation Discussion",
        description: "Help Alex plan how to spend $10k on marketing.",
        customer_mood: "Energetic but scattered",
        objectives: ["Focus spending", "Prioritize quick wins"],
        context: "Late-night call, founder's home office",
        urgency: "High",
      },
      {
        name: "Value Proposition Refinement",
        description: "Rework startup tagline and brand voice",
        customer_mood: "Frustrated",
        objectives: ["Clarify target audience", "Simplify messaging"],
        context: "Slack thread review and follow-up call",
        urgency: "Medium",
      },
    ],
    created_at: "2024-06-16T11:15:00Z",
  },
  {
    id: "scn-003",
    program: {
      id: "prog-003",
      user_id: "user-789",
      topic: {
        id: "topic-003",
        title: "Digital Transformation in HR",
        organisation: {
          id: "org-003",
          name: "PeopleOps Global",
          created_at: "2023-03-20T15:00:00Z",
        },
        metadatas: {
          prompt: "Help clients manage change during HR tech rollouts.",
        },
        started_at: "2024-06-05T09:00:00Z",
      },
      assignment_prompt: "Develop a change management plan for an HRIS migration.",
      metadatas: {
        day: 2,
        topics: "HRIS, Adoption Strategy",
        exercises: "Plan drafting, roleplay communication",
      },
      assignment_type: "MULTIPLE_CHOICE",
      status: "ACTIVE",
      started_at: "2024-06-05T09:00:00Z",
    },
    persona: {
      name: "Jared Lopez",
      role: "Head of HR",
      company_size: "250 employees",
      pain_points: ["Low tech adoption", "Internal resistance to change"],
      budget_range: "$50,000 - $100,000",
      decision_style: "Consensus-driven",
      objections: ["Will this reduce jobs?", "Too complex to implement"],
      personality_traits: ["Empathetic", "Cautious", "Team-focused"],
      voice: "Supportive and inclusive",
      background: "15 years in HR, strong culture advocate",
      communication_style: "Collaborative",
      current_challenge: "Ensuring smooth transition to new HRIS",
      specific_context: "Company is merging with another org",
      time_pressure: "Moderate – go-live in 45 days",
      emotional_state: "Stressed but motivated",
      competitors_used: ["Workday", "BambooHR"],
    },
    scenarios: [
      {
        name: "Department Head Briefing",
        description: "Jared needs help crafting a rollout message for managers.",
        customer_mood: "Worried about backlash",
        objectives: ["Build manager buy-in", "Avoid rumors"],
        context: "Internal company town hall prep",
        urgency: "High",
      },
      {
        name: "Training Session Planning",
        description: "Design a training strategy for HR platform users.",
        customer_mood: "Hopeful",
        objectives: ["Maximize engagement", "Minimize disruption"],
        context: "Workshop strategy session",
        urgency: "Medium",
      },
    ],
    created_at: "2024-06-06T10:45:00Z",
  },
];
