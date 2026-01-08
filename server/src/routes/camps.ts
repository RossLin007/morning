
import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";
import { z } from "zod";

const router = express.Router();

// Validation Schema
const CreateCampSchema = z.object({
    period: z.number(),
    theme: z.string().min(1),
    startDate: z.string(),
    endDate: z.string(),
    dailyStartTime: z.string(),
    dailyEndTime: z.string(),
    price: z.number(),
    enrollmentCap: z.number(),
    schedule: z.array(z.any()),
    marketing: z.object({
        heroImage: z.string().optional(),
        corePhilosophy: z.string(),
        features: z.array(z.string()),
        agreements: z.array(z.string()),
    }),
});

// POST /api/camps - Create a new camp
router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        // Validate Input
        const validatedData = CreateCampSchema.parse(req.body);

        // Insert into Supabase
        const { data, error } = await supabaseAdmin
            .from('morning_camps')
            .insert({
                period: validatedData.period,
                theme: validatedData.theme,
                start_date: validatedData.startDate, // Maps to DB snake_case
                end_date: validatedData.endDate,
                price: validatedData.price,
                enrollment_cap: validatedData.enrollmentCap,
                status: 'draft', // Default status
                schedule: validatedData.schedule,
                marketing: validatedData.marketing,
                team: [], // Default empty team
                created_by: req.user.id
            })
            .select()
            .single();

        if (error) {
            console.error("[Camps] DB Insert Error:", error.message);
            return res.status(500).json({ error: error.message });
        }

        console.log(`[Camps] Created new camp: ${data.theme} (ID: ${data.id})`);
        res.status(201).json(data);

    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation failed", details: err.errors });
        }
        console.error("[Camps] Create Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
