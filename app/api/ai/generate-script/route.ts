import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ScenarioDetail } from "~/types/scenario";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { scenario, quality, learner_profile } = await request.json();

    if (!scenario || !quality || !learner_profile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const scenarioData = scenario as ScenarioDetail;

    // Generate conversation script based on quality level
    const script = await generateConversationScript(scenarioData, quality);

    return NextResponse.json({
      success: true,
      script,
    });
  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json({ error: "Failed to generate script" }, { status: 500 });
  }
}

async function generateConversationScript(
  scenario: ScenarioDetail,
  quality: string
): Promise<string> {
  const qualityPrompts = {
    bad: `**Quality: Terrible**. The learner must be incompetent.
- **Mistakes**: Unprepared, nervous, excessive filler words ("um", "uh"), interrupts, poor grammar.
- **Strategy**: No research, pitches immediately, fails to listen or ask questions.
- **Objections**: Handles them poorly with weak, vague answers.
- **Outcome**: Fails to build rapport, annoys the client, no clear next steps. The conversation should be cringe-worthy and a clear example of what not to do.`,

    medium: `**Quality: Average**. The learner is mediocre.
- **Mistakes**: Some filler words, occasional awkwardness, misses some client cues.
- **Strategy**: Basic preparation but feels scripted. Asks some questions but lacks depth.
- **Objections**: Handles simple objections but struggles with difficult ones.
- **Outcome**: Professional but not memorable. Next steps are vague. The client is polite but not truly engaged.`,

    good: `**Quality: Excellent**. The learner is a top performer.
- **Mistakes**: Flawless execution. Confident, clear, and professional.
- **Strategy**: Deep research is evident. Builds genuine rapport, asks insightful discovery questions, and listens actively.
- **Objections**: Handles them with empathy, data, and compelling stories.
- **Outcome**: Builds strong value, creates urgency without being pushy, and secures clear, committed next steps. The client feels understood and is excited to proceed.`,
  };

  const prompt = `You are an expert sales trainer creating a realistic conversation script for training.

**Task:** Generate a dialogue between a "Client" and a "Learner" based on the following scenario and quality requirements. The difference between quality levels must be dramatic and obvious.

**Scenario Context:**
- **Description**: ${scenario.description}
- **Industry/Specialty**: ${scenario.specialty}
- **Call Type**: ${scenario.call_type}
- **Learner's Goal**: ${scenario.intent}
- **Potential Client Objections**: ${scenario.objections?.join(", ") || "Price, timing, need"}

**Execution Requirements:**
${qualityPrompts[quality as keyof typeof qualityPrompts]}

**Formatting Rules:**
1.  Start with the Client. Alternate between "Client:" and "Learner:".
2.  The script must contain 8-12 total exchanges.
3.  The dialogue must be specific to the **${scenario.specialty}** industry.
4.  The Learner's performance must strictly adhere to the specified quality level.

Generate the script now.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a world-class sales training expert. Your task is to generate realistic, industry-specific sales conversation scripts. You must strictly follow all instructions, especially the specified quality level for the salesperson's performance.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || "Failed to generate script";
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Fallback to mock data if OpenAI fails
    const mockScripts = {
      bad: `Client: Hello, who is this?
Learner: Um, hi... this is... uh... John from ABC Company. I'm calling about our product.
Client: What product? I'm busy.
Learner: Well, we have this solution that... it's really good and might help you.
Client: I'm not interested.
Learner: But wait, you should really consider it because... um... it's popular?
Client: I said I'm not interested. Please remove me from your list.
Learner: Oh, okay... sorry to bother you.
Client: *click*
Learner: Hello? Hello? Did they hang up?`,

      medium: `Client: Hello, this is Sarah.
Learner: Hi Sarah, this is Mike from TechSolutions. I'm calling because I noticed your company might benefit from our ${scenario.category} solution.
Client: We're pretty happy with our current setup. What makes yours different?
Learner: That's a great question. Our platform helps companies like yours streamline their processes and reduce costs by about 20%.
Client: That sounds interesting, but we just invested in a new system last year.
Learner: I understand that timing can be challenging. Many of our clients had similar concerns, but they found that our solution actually complemented their existing systems.
Client: I'd need to see some concrete examples of how this works.
Learner: Absolutely. Would you be open to a brief demo next week where I can show you specific case studies from companies in your industry?
Client: Maybe. Send me some information first and I'll review it.
Learner: Perfect. I'll send you a case study and some ROI calculations. What's the best email to reach you?`,

      good: `Client: Hello, this is David.
Learner: Hi David, this is Jennifer from InnovateCorp. I've been researching companies in the ${scenario.specialty} space and noticed that your company has been growing rapidly. Congratulations on your recent expansion!
Client: Thank you! Yes, we've been busy. What can I help you with?
Learner: I'll be brief since I know you're busy. I reached out because many companies your size face challenges with ${scenario.category} as they scale. I'm curious - what's been your biggest challenge in this area lately?
Client: Actually, we have been struggling with efficiency. Our current process takes too much manual work.
Learner: That's exactly what I thought might be the case. We've helped three companies similar to yours reduce manual work by 60% while improving accuracy. Would you be interested in hearing how they achieved that?
Client: I'm listening, but we've looked at solutions before and they were too expensive.
Learner: I completely understand that concern. Cost is always a factor. The companies I mentioned actually found that our solution paid for itself within 6 months through the efficiency gains alone. What if I could show you a specific ROI analysis based on your company size and industry?
Client: That would be helpful. But I'd need to involve my team in any decision.
Learner: Absolutely, and I'd expect nothing less from a thorough leader. How about this - I'll prepare a customized analysis and present it to you and your key team members. Does next Tuesday or Wednesday work better for a 30-minute session?
Client: Tuesday afternoon could work. Send me the details and I'll check with my team.
Learner: Perfect. I'll send you a calendar invite for Tuesday at 2 PM with the presentation materials attached. I'll also include case studies from those similar companies I mentioned. Sound good?
Client: Yes, that works. Looking forward to it.
Learner: Excellent. Thank you for your time, David. I'll follow up with those materials today.`
    };

    return mockScripts[quality as keyof typeof mockScripts] || mockScripts.medium;
  }
}