import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API: AI-Powered Tutor Recommendation (Full-Stack Proxy Route)
  app.post("/api/ai/recommend", async (req, res) => {
    const { studentPrompt, tutors, studentProfile } = req.body;
    
    if (!studentPrompt) {
      return res.status(400).json({ error: "Missing search/student query prompt." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isMockKey = !apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "";

    if (isMockKey) {
      // Graceful Rule-Based Fallback when GEMINI_API_KEY is not configured
      console.log("No GEMINI_API_KEY found, running TutorConnect Rule-Based AI engine...");
      const searchLower = studentPrompt.toLowerCase();
      
      // Keyword matching matching
      const matches = tutors.filter((t: any) => {
        const titleMatch = t.title.toLowerCase().includes(searchLower);
        const subjectMatch = t.subjects.some((sub: string) => searchLower.includes(sub.toLowerCase()) || sub.toLowerCase().includes(searchLower));
        const classMatch = t.classes.some((cls: string) => searchLower.includes(cls.toLowerCase()));
        const aboutMatch = t.about.toLowerCase().includes(searchLower);
        return titleMatch || subjectMatch || classMatch || aboutMatch;
      });

      const selectedTutors = matches.slice(0, 3);
      const recommendedTutorIds = selectedTutors.map((t: any) => t.userId);
      
      // If no keyword match, recommend featured tutors or first 2 tutors
      if (recommendedTutorIds.length === 0) {
        const featured = tutors.filter((t: any) => t.isFeatured);
        recommendedTutorIds.push(...(featured.length > 0 ? featured : tutors).slice(0, 2).map((t: any) => t.userId));
      }

      const justifications: Record<string, string> = {};
      recommendedTutorIds.forEach((id: string) => {
        const tutor = tutors.find((t: any) => t.userId === id);
        if (tutor) {
          justifications[id] = `Dr. Aarav's Indian educational framework recommended ${tutor.name} based on their specialized credentials, holding ${tutor.experience}+ years in ${tutor.subjects.join(', ')} tuition.`;
        }
      });

      return res.json({
        recommendedTutorIds,
        aiAnalysis: `[FALLBACK MATCHING ACTIVE] We analyzed your learning goals ("${studentPrompt}") and found tutors who match your requested classes. (Setup your GEMINI_API_KEY in the Secrets panel to activate neural recommendations).`,
        justifications
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const promptContext = `
        You are TutorConnect India's elite academic recommendation advisor.
        A student/parent is looking for educational help with the following query:
        "${studentPrompt}"

        The student's profile details:
        Name: ${studentProfile?.name || 'Guest Student'}
        City: ${studentProfile?.city || 'India'}
        
        Here is the catalog of available tutors in our database:
        ${JSON.stringify(tutors.map((t: any) => ({
          userId: t.userId,
          name: t.name,
          title: t.title,
          subjects: t.subjects,
          classes: t.classes,
          fees: t.fees,
          teachingModes: t.teachingModes,
          languages: t.languages,
          experience: t.experience,
          qualification: t.qualification,
          about: t.about
        })))}

        Analyze the student's prompt and select up to 3 tutors who are the absolute best match.
        Provide:
        1. An array of recommendedTutorIds.
        2. A short overall aiAnalysis paragraph explaining the match.
        3. A dictionary/object "justifications" mapping each selected tutorId to a personalized matching reason explaining how they fit the request.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptContext,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedTutorIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of userIds for matching tutors, max 3."
              },
              aiAnalysis: {
                type: Type.STRING,
                description: "A summary explaining the choice of tutors and smart learning tips."
              },
              justifications: {
                type: Type.OBJECT,
                description: "Key-value pair where keys are tutorId and values are detailed justifications."
              }
            },
            required: ["recommendedTutorIds", "aiAnalysis", "justifications"]
          }
        }
      });

      const responseText = response.text || "{}";
      const recommendations = JSON.parse(responseText.trim());
      res.json(recommendations);
    } catch (error) {
      console.error("Gemini recommendation route error:", error);
      res.status(500).json({ error: "Failed to generate recommendation via Gemini API." });
    }
  });

  // Serve static UI assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TutorConnect Server] Booted successfully. Running on port ${PORT}`);
  });
}

startServer();
