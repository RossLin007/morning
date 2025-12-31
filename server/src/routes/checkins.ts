import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { data, error } = await supabaseAdmin
        .from('user_checkins')
        .select('checkin_date')
        .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data.map((d: any) => d.checkin_date));
});

router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { date } = req.body;
    const { data, error } = await supabaseAdmin
        .from('user_checkins')
        .upsert({
            user_id: req.user.id,
            checkin_date: date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

export default router;