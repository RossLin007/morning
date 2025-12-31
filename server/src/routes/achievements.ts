import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { authenticateUser, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { data, error } = await supabaseAdmin
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.post("/:achievementId/unlock", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { achievementId } = req.params;
    
    const { data, error } = await supabaseAdmin
        .from('user_achievements')
        .upsert({
            user_id: req.user.id,
            achievement_id: achievementId,
            unlocked_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

export default router;