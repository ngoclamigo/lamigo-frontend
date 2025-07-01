import type { LearningPath } from "~/types/learning-path";
import type { Scenario } from "~/types/scenario";

export const mockLearningPaths: LearningPath[] = [
  {
    id: "capital-iq-fundamentals",
    title: "S&P Capital IQ Pro Fundamentals",
    description:
      "Master the basics of S&P Capital IQ Pro platform, including navigation, company research, and financial data analysis.",
    duration_estimate_hours: 10,
    activities: [
      {
        id: "platform-intro-slide",
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
          narration:
            "S&P Capital IQ Pro is a powerful all‑in‑one market intelligence platform designed for finance professionals, analysts, and corporate teams. It also integrates seamlessly with Excel, PowerPoint, and Word via Office Tools for one‑click model refreshes, offers mobile access, real‑time market monitoring dashboards, ESG and supply‑chain intelligence from Sustainable1, and curated news from top outlets like Dow Jones and WSJ.",
        },
      },
      {
        id: "navigation-quiz",
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
        id: "platform-tutorial-video",
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
        id: "financial-analysis-flashcard",
        title: "Financial Analysis Concepts",
        type: "flashcard",
        config: {
          cards: [
            {
              front: "What is EBITDA?",
              back: "EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It's a measure of a company's overall financial performance and is used as an alternative to net income in some circumstances.",
              tags: ["Financial Metrics", "Valuation", "Analysis"],
            },
            {
              front: "What is the EV/EBITDA multiple?",
              back: "Enterprise Value to EBITDA (EV/EBITDA) is a valuation ratio that compares a company's enterprise value to its earnings before interest, taxes, depreciation, and amortization. It's commonly used to determine the value of a company and compare it to similar businesses.",
              tags: ["Valuation Multiples", "Financial Analysis"],
            },
            {
              front: "What is a DCF model?",
              back: "Discounted Cash Flow (DCF) is a valuation method used to estimate the value of an investment based on its expected future cash flows. DCF analysis attempts to determine the value of an investment today, based on projections of how much money it will generate in the future.",
              tags: ["Valuation", "Financial Modeling"],
            },
            {
              front: "What is a comp table?",
              back: "A comparable company analysis (comp table) is a valuation methodology that compares the current financial metrics of similar companies to determine the relative value of a target company. Common metrics include EV/EBITDA, P/E ratio, and revenue multiples.",
              tags: ["Valuation", "Financial Analysis", "Comps"],
            },
          ],
        },
      },
      {
        id: "capital-iq-features-matching",
        title: "Match Capital IQ Features to Use Cases",
        type: "matching",
        config: {
          instruction: "Connect each Capital IQ Pro feature with its primary use case.",
          pairs: [
            {
              left: "Screening & Analytics",
              right: "Find companies that match specific financial criteria",
            },
            {
              left: "Excel Plugin",
              right: "Pull live financial data directly into spreadsheets",
            },
            {
              left: "Company Tearsheet",
              right: "Get comprehensive overview of a single company",
            },
            {
              left: "News & Research",
              right: "Stay updated on market events and analyst reports",
            },
          ],
          success_message: "Great! You understand how to use Capital IQ Pro's key features.",
        },
      },
      {
        id: "capital-iq-terminology-blanks",
        title: "Capital IQ Pro Terminology",
        type: "fill_blanks",
        config: {
          instruction: "Complete these sentences about Capital IQ Pro features and terminology.",
          text_with_blanks:
            "A company _____ provides a one-page summary of key financial metrics and information. The _____ function allows you to filter companies based on specific criteria. _____ data shows real-time stock prices and trading volumes. The _____ plugin enables you to pull Capital IQ data directly into spreadsheets.",
          blanks: [
            {
              position: 1,
              correct_answers: ["Tearsheet", "Tear Sheet"],
              feedback: "A tearsheet provides a comprehensive one-page overview of a company.",
            },
            {
              position: 2,
              correct_answers: ["Screening", "Screen"],
              feedback: "Screening allows you to filter companies by financial criteria.",
            },
            {
              position: 3,
              correct_answers: ["Market", "Trading"],
              feedback: "Market data provides real-time pricing and trading information.",
            },
            {
              position: 4,
              correct_answers: ["Excel", "Office"],
              feedback: "The Excel plugin integrates Capital IQ data with spreadsheets.",
            },
          ],
          success_message: "Perfect! You're becoming a Capital IQ Pro expert!",
        },
      },
      {
        id: "capital-iq-docs-embed",
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
    id: "advanced-financial-modeling",
    title: "Advanced Financial Modeling with Capital IQ",
    description:
      "Learn how to build sophisticated financial models using data from S&P Capital IQ Pro and Excel integration.",
    duration_estimate_hours: 15,
    activities: [
      {
        id: "excel-plugin-slide",
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
          narration:
            "Excel Integration with Capital IQ Pro enables users to seamlessly access and analyze real-time financial data directly within Microsoft Excel. By leveraging the powerful add-in, professionals can pull in key metrics, financial statements, market data, and proprietary Capital IQ analytics into customizable spreadsheets. This integration streamlines workflows for investment research, valuation modeling, and financial analysis by ensuring data is accurate, up-to-date, and easily refreshable without switching platforms.",
        },
      },
      {
        id: "dcf-modeling-video",
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
        id: "financial-model-quiz",
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
        id: "valuation-simulator",
        title: "Interactive Valuation Simulator",
        type: "embed",
        config: {
          url: "https://valuingtools.com/en/valuation-simulator",
          title: "Company Valuation Simulator",
          description:
            "Interactive tool to practice valuation techniques and see how changing assumptions affects company value",
          embed_type: "article",
        },
      },
      {
        id: "financial-terminology-blanks",
        title: "Financial Terminology Fill-in-the-Blanks",
        type: "fill_blanks",
        config: {
          instruction:
            "Complete the sentences by dragging the correct financial terms into the blanks.",
          text_with_blanks:
            "The _____ represents the total market value of a company's outstanding shares. To calculate enterprise value, you add _____ to market capitalization. The _____ ratio compares a company's stock price to its earnings per share. A company's _____ margin shows how much profit it makes on each dollar of revenue.",
          blanks: [
            {
              position: 1,
              correct_answers: ["Market Cap", "Market Capitalization"],
              feedback: "Market capitalization is the total value of a company's shares.",
            },
            {
              position: 2,
              correct_answers: ["Net Debt", "Debt"],
              feedback: "Net debt is added to market cap to get enterprise value.",
            },
            {
              position: 3,
              correct_answers: ["P/E", "Price-to-Earnings"],
              feedback: "P/E ratio compares stock price to earnings per share.",
            },
            {
              position: 4,
              correct_answers: ["Gross", "Profit"],
              feedback: "Gross margin shows profit as a percentage of revenue.",
            },
          ],
          success_message: "Excellent! You've mastered these key financial terms!",
        },
      },
      {
        id: "valuation-metrics-matching",
        title: "Match Valuation Metrics to Definitions",
        type: "matching",
        config: {
          instruction: "Drag each valuation metric to its correct definition.",
          pairs: [
            {
              left: "EV/EBITDA",
              right:
                "Enterprise value divided by earnings before interest, taxes, depreciation, and amortization",
            },
            {
              left: "P/E Ratio",
              right: "Stock price divided by earnings per share",
            },
            {
              left: "P/B Ratio",
              right: "Market value of equity divided by book value of equity",
            },
            {
              left: "DCF Valuation",
              right: "Present value of projected future cash flows",
            },
            {
              left: "WACC",
              right: "Weighted average cost of capital used as discount rate",
            },
          ],
          success_message: "Perfect! You understand how these valuation metrics work.",
        },
      },
      {
        id: "valuation-flashcard",
        title: "Valuation Concepts",
        type: "flashcard",
        config: {
          cards: [
            {
              front: "What is WACC?",
              back: "WACC (Weighted Average Cost of Capital) represents a company's average cost of financing its assets, weighted according to the proportion of debt and equity in its capital structure. It's used as the discount rate in DCF valuation models.",
              tags: ["WACC", "Valuation", "DCF"],
            },
            {
              front: "What is a LBO model?",
              back: "A Leveraged Buyout (LBO) model is a financial model used to evaluate the acquisition of a company through significant use of debt financing. The model projects cash flows to determine if the acquired company can generate sufficient returns to service the debt and provide adequate returns to equity investors.",
              tags: ["LBO", "Financial Modeling", "Private Equity"],
            },
            {
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
    id: "market-intelligence",
    title: "Market Intelligence and Sector Analysis",
    description:
      "Learn how to leverage S&P Capital IQ Pro for comprehensive industry research, market trends, and competitive analysis.",
    duration_estimate_hours: 8,
    activities: [
      {
        id: "sector-analysis-intro",
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
          narration:
            "Industry Research with Capital IQ Pro provides comprehensive data, analytics, and insights to help users understand market dynamics, assess competitive landscapes, and identify growth opportunities across sectors. It combines in-depth industry reports, financial metrics, macroeconomic indicators, and proprietary forecasts, all accessible through a customizable platform. This empowers investment professionals, corporate strategists, and analysts to make informed decisions backed by reliable and up-to-date information.",
        },
      },
      {
        id: "industry-analysis-interactive",
        title: "Interactive Industry Analysis Tool",
        type: "embed",
        config: {
          url: "https://valuingtools.com/en/valuation-simulator",
          title: "Industry Analysis Simulation",
          description:
            "Interactive tool to analyze different industries and their key metrics, competitive landscape, and growth trends",
          embed_type: "article",
        },
      },
      {
        id: "analyst-interview-video",
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
        id: "market-intelligence-quiz",
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
    id: "intro-to-react",
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
    persona: {
      name: "Alex Johnson",
      job_title: "Founder & CEO",
      company: "Startup Solutions",
      industry: "Tech Startups",
      location: "New York, NY",
    },
    scenarios: [
      {
        name: "Introductory Call with Tech Startup",
        description: "Initial call to understand the startup's needs and pitch our solution",
        type: "call_scenario",
        category: "Sales Call",
        call_type: "Introductory Call",
        intent: "Understand business needs and pitch solution",
        persona: ["Risk-Averse", "Committee Buyer"],
        objections: ["Too expensive", "Not the right time"],
        specialty: "Tech Startups",
        time_limit: "30 minutes",
        roleplay_tips: ["Be concise", "Focus on value proposition", "Listen actively"],
      },
    ],
    created_at: "2024-06-16T11:15:00Z",
  },
  {
    id: "scn-002",
    persona: {
      name: "Jared Miller",
      job_title: "Director of Operations",
      company: "Global Enterprises",
      industry: "Manufacturing",
      location: "Chicago, IL",
    },
    scenarios: [
      {
        name: "Operations Call for Supply Chain Issues",
        description: "Discuss supply chain challenges and propose solutions",
        type: "call_scenario",
        category: "Operations Call",
        call_type: "Problem Resolution Call",
        intent: "Resolve supply chain issues and improve efficiency",
        persona: ["Analytical", "Data-Driven"],
        objections: ["Need more data", "Previous solutions failed"],
        specialty: "Supply Chain Management",
        time_limit: "45 minutes",
        roleplay_tips: [
          "Use data to support claims",
          "Be prepared for technical questions",
          "Offer multiple solutions",
        ],
      },
    ],
    created_at: "2024-06-06T10:45:00Z",
  },
  {
    id: "scn-003",
    persona: {
      name: "Sandra Thompson",
      job_title: "VP of Marketing",
      company: "Tech Innovations Inc.",
      industry: "Technology",
      location: "San Francisco, CA",
    },
    scenarios: [
      {
        name: "Marketing Strategy Call",
        description: "Discuss new marketing strategies and campaigns",
        type: "call_scenario",
        category: "Marketing Call",
        call_type: "Strategy Discussion",
        intent: "Discuss new marketing strategies and campaigns",
        persona: ["Creative", "Visionary"],
        objections: ["Budget constraints", "Need for quick results"],
        specialty: "Digital Marketing",
        time_limit: "60 minutes",
        roleplay_tips: [
          "Be innovative with ideas",
          "Focus on ROI of marketing strategies",
          "Prepare for budget discussions",
        ],
      },
    ],
    created_at: "2024-06-02T09:30:00Z",
  },
];
