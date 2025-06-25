import { LearningPath } from '@/types/learning-path';

export const mockLearningPaths: LearningPath[] = [
  {
    path_id: 'capital-iq-fundamentals',
    title: 'S&P Capital IQ Pro Fundamentals',
    description: 'Master the basics of S&P Capital IQ Pro platform, including navigation, company research, and financial data analysis.',
    duration_estimate_hours: 10,
    activities: [
      {
        activity_id: 'platform-intro-slide',
        title: 'Introduction to Capital IQ Pro',
        type: 'slide',
        config: {
          title: 'Getting Started with S&P Capital IQ Pro',
          content: `
            <h2>What is S&P Capital IQ Pro?</h2>
            <p>S&P Capital IQ Pro is a comprehensive financial intelligence platform that provides data, analytics, and research on public and private companies, markets, and industries worldwide.</p>

            <h3>Key Features:</h3>
            <ul>
              <li><strong>Company Screening:</strong> Filter companies based on financial metrics and criteria</li>
              <li><strong>Financial Data:</strong> Access to comprehensive financial statements and ratios</li>
              <li><strong>Market Intelligence:</strong> Real-time market data and news</li>
              <li><strong>Excel Integration:</strong> Pull data directly into spreadsheets for analysis</li>
            </ul>

            <h3>Why Use Capital IQ Pro?</h3>
            <p>Capital IQ Pro offers unparalleled depth of financial information, making it essential for financial analysts, investment bankers, private equity professionals, and corporate strategists.</p>
          `
        }
      },
      {
        activity_id: 'navigation-quiz',
        title: 'Platform Navigation Quiz',
        type: 'quiz',
        config: {
          question: 'Which section of Capital IQ Pro would you use to find comparable company analysis?',
          options: [
            'News & Research',
            'Screening & Analytics',
            'Markets',
            'Excel Plugin'
          ],
          correct_answer: 1,
          explanation: 'The Screening & Analytics section allows you to build company peer groups and perform comparative analysis using various financial metrics and multiples.'
        }
      },
      {
        activity_id: 'platform-tutorial-video',
        title: 'Capital IQ Platform Tutorial',
        type: 'embed',
        config: {
          url: 'https://www.youtube.com/embed/eCjqEaWZvHg?si=oTZGa3ZuRsXu77M5',
          title: 'S&P Capital IQ Pro Platform Tutorial',
          description: 'A comprehensive walkthrough of the Capital IQ Pro interface and key features',
          embed_type: 'video',
        }
      },
      {
        activity_id: 'financial-analysis-flashcard',
        title: 'Financial Analysis Concepts',
        type: 'flashcard',
        config: {
          cards: [
            {
              id: 'fin-1',
              front: 'What is EBITDA?',
              back: 'EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It\'s a measure of a company\'s overall financial performance and is used as an alternative to net income in some circumstances.',
              tags: ['Financial Metrics', 'Valuation', 'Analysis']
            },
            {
              id: 'fin-2',
              front: 'What is the EV/EBITDA multiple?',
              back: 'Enterprise Value to EBITDA (EV/EBITDA) is a valuation ratio that compares a company\'s enterprise value to its earnings before interest, taxes, depreciation, and amortization. It\'s commonly used to determine the value of a company and compare it to similar businesses.',
              tags: ['Valuation Multiples', 'Financial Analysis']
            },
            {
              id: 'fin-3',
              front: 'What is a DCF model?',
              back: 'Discounted Cash Flow (DCF) is a valuation method used to estimate the value of an investment based on its expected future cash flows. DCF analysis attempts to determine the value of an investment today, based on projections of how much money it will generate in the future.',
              tags: ['Valuation', 'Financial Modeling']
            },
            {
              id: 'fin-4',
              front: 'What is a comp table?',
              back: 'A comparable company analysis (comp table) is a valuation methodology that compares the current financial metrics of similar companies to determine the relative value of a target company. Common metrics include EV/EBITDA, P/E ratio, and revenue multiples.',
              tags: ['Valuation', 'Financial Analysis', 'Comps']
            }
          ]
        }
      },
      {
        activity_id: 'capital-iq-docs-embed',
        title: 'S&P Capital IQ Pro Documentation',
        type: 'embed',
        config: {
          url: 'https://www.spglobal.com/marketintelligence/en/solutions/sp-capital-iq-pro',
          title: 'S&P Capital IQ Pro Official Documentation',
          description: 'Explore the official documentation to deepen your understanding of the platform',
          embed_type: 'article' as const
        }
      }
    ]
  },
  {
    path_id: 'advanced-financial-modeling',
    title: 'Advanced Financial Modeling with Capital IQ',
    description: 'Learn how to build sophisticated financial models using data from S&P Capital IQ Pro and Excel integration.',
    duration_estimate_hours: 15,
    activities: [
      {
        activity_id: 'excel-plugin-slide',
        title: 'Capital IQ Excel Plugin Basics',
        type: 'slide',
        config: {
          title: 'Excel Integration with Capital IQ Pro',
          content: `
            <h2>Leveraging the Excel Plugin</h2>
            <p>The S&P Capital IQ Pro Excel Plugin allows analysts to pull financial data directly into spreadsheets for advanced modeling and analysis.</p>

            <h3>Key Functions:</h3>
            <ul>
              <li>CIQ() - Retrieve specific data points for companies</li>
              <li>CIQCF() - Pull complete financial statements</li>
              <li>CIQINDEX() - Access index and market data</li>
              <li>CIQTRADE() - Get trading and pricing information</li>
            </ul>

            <h3>Benefits of Excel Integration:</h3>
            <ol>
              <li>Automate data collection</li>
              <li>Ensure data accuracy</li>
              <li>Create dynamic models that update with fresh data</li>
              <li>Build custom templates for recurring analyses</li>
            </ol>
          `
        }
      },
      {
        activity_id: 'dcf-modeling-video',
        title: 'DCF Modeling Using Capital IQ Data',
        type: 'embed',
        config: {
          url: 'https://www.youtube.com/embed/nyot7FkYoqM?si=_HoasUaIip3pstEF',
          title: 'Building a DCF Model with Capital IQ Data',
          description: 'Step-by-step tutorial on creating a discounted cash flow model using Capital IQ data',
          embed_type: 'video',
        }
      },
      {
        activity_id: 'financial-model-quiz',
        title: 'Financial Modeling Quiz',
        type: 'quiz',
        config: {
          question: 'Which Excel function in Capital IQ would you use to pull a 5-year income statement for a company?',
          options: [
            'CIQ()',
            'CIQCF()',
            'CIQINDEX()',
            'CIQTRADE()'
          ],
          correct_answer: 1,
          explanation: 'CIQCF() is used to pull complete financial statements, including income statements, balance sheets, and cash flow statements for specified time periods.'
        }
      },
      {
        activity_id: 'valuation-simulator',
        title: 'Interactive Valuation Simulator',
        type: 'embed',
        config: {
          url: 'https://valuingtools.com/en/valuation-simulator',
          title: 'Company Valuation Simulator',
          description: 'Interactive tool to practice valuation techniques and see how changing assumptions affects company value',
          embed_type: 'interactive',
        }
      },
      {
        activity_id: 'valuation-flashcard',
        title: 'Valuation Concepts',
        type: 'flashcard',
        config: {
          cards: [
            {
              id: 'val-1',
              front: 'What is WACC?',
              back: 'WACC (Weighted Average Cost of Capital) represents a company\'s average cost of financing its assets, weighted according to the proportion of debt and equity in its capital structure. It\'s used as the discount rate in DCF valuation models.',
              tags: ['WACC', 'Valuation', 'DCF']
            },
            {
              id: 'val-2',
              front: 'What is a LBO model?',
              back: 'A Leveraged Buyout (LBO) model is a financial model used to evaluate the acquisition of a company through significant use of debt financing. The model projects cash flows to determine if the acquired company can generate sufficient returns to service the debt and provide adequate returns to equity investors.',
              tags: ['LBO', 'Financial Modeling', 'Private Equity']
            },
            {
              id: 'val-3',
              front: 'What is a sensitivity analysis?',
              back: 'Sensitivity analysis is a technique used in financial modeling to determine how different values of an independent variable affect a particular dependent variable under specific conditions. It helps assess how changes in key assumptions impact valuation outcomes.',
              tags: ['Financial Modeling', 'Valuation', 'Analysis']
            }
          ]
        }
      }
    ]
  },
  {
    path_id: 'market-intelligence',
    title: 'Market Intelligence and Sector Analysis',
    description: 'Learn how to leverage S&P Capital IQ Pro for comprehensive industry research, market trends, and competitive analysis.',
    duration_estimate_hours: 8,
    activities: [
      {
        activity_id: 'sector-analysis-intro',
        title: 'Sector Analysis Framework',
        type: 'slide',
        config: {
          title: 'Industry Research with Capital IQ Pro',
          content: `
            <h2>Sector and Industry Analysis</h2>
            <p>S&P Capital IQ Pro provides powerful tools for analyzing industries, sectors, and market trends to inform investment decisions and strategic planning.</p>

            <h3>Key Industry Analysis Features:</h3>
            <ul>
              <li>Industry Primers and Reports</li>
              <li>Sector-Specific Metrics and KPIs</li>
              <li>Competitive Landscape Analysis</li>
              <li>Market Share Data</li>
              <li>Industry Growth Projections</li>
            </ul>

            <h3>Analytical Framework:</h3>
            <p>A comprehensive sector analysis typically includes examination of market structure, competitive dynamics, regulatory environment, growth drivers, and financial performance metrics specific to the industry.</p>
          `
        }
      },
      {
        activity_id: 'industry-analysis-interactive',
        title: 'Interactive Industry Analysis Tool',
        type: 'embed',
        config: {
          url: 'https://valuingtools.com/en/valuation-simulator',
          title: 'Industry Analysis Simulation',
          description: 'Interactive tool to analyze different industries and their key metrics, competitive landscape, and growth trends',
          embed_type: 'interactive',
        }
      },
      {
        activity_id: 'analyst-interview-video',
        title: 'Industry Expert Interview',
        type: 'embed',
        config: {
          url: 'https://www.youtube.com/embed/CUa30M_FPhk?si=phtpHJ211FPsnpce',
          title: 'Interview with Senior Industry Analyst',
          description: 'Learn how professional analysts use Capital IQ Pro for comprehensive market intelligence',
          embed_type: 'video',
        }
      },
      {
        activity_id: 'market-intelligence-quiz',
        title: 'Market Intelligence Quiz',
        type: 'quiz',
        config: {
          question: 'Which Capital IQ Pro feature would be most useful for identifying the top 10 companies in an industry by revenue growth?',
          options: [
            'News & Research Center',
            'Company Tearsheet',
            'Screening & Analytics',
            'Transaction Screening'
          ],
          correct_answer: 2,
          explanation: 'The Screening & Analytics feature allows you to create custom screens based on industry classification and financial metrics like revenue growth to identify top performers in a sector.'
        }
      }
    ]
  }
];

// Mock Progress Data
export const mockProgress = [
  {
    progress_id: 'prog-1',
    learner_id: 'current-learner-id',
    path_id: 'market-intelligence',
    activity_id: 'market-intelligence-quiz',
    status: 'completed' as const,
    completion_percentage: 100,
    time_spent_minutes: 15,
    last_accessed: '2025-06-25T10:00:00Z',
    started_at: '2025-06-25T09:45:00Z',
    completed_at: '2025-06-25T10:00:00Z',
  },
  {
    progress_id: 'prog-2',
    learner_id: 'current-learner-id',
    path_id: 'capital-iq-fundamentals',
    activity_id: 'financial-analysis-flashcard',
    status: 'in_progress' as const,
    completion_percentage: 50,
    time_spent_minutes: 8,
    last_accessed: '2025-06-25T10:15:00Z',
    started_at: '2025-06-25T10:00:00Z',
  }
];

// Mock Achievements Data
export const mockAchievements = [
  {
    achievement_id: 'ach-1',
    learner_id: 'current-learner-id',
    title: 'First Steps',
    description: 'Completed your first learning activity',
    type: 'completion' as const,
    earned_at: '2025-06-25T10:00:00Z',
    points: 10,
    path_id: 'intro-to-react',
  },
  {
    achievement_id: 'ach-2',
    learner_id: 'current-learner-id',
    title: 'Quiz Master',
    description: 'Answered 5 quiz questions correctly',
    type: 'skill_based' as const,
    earned_at: '2025-06-25T10:15:00Z',
    points: 25,
  }
];
