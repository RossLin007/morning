
import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { authenticateUser, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { data, error } = await supabaseAdmin
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data.map((item: any) => item.lesson_id));
});

router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { lesson_ids } = req.body;

    if (!Array.isArray(lesson_ids)) return res.status(400).json({ error: "lesson_ids must be an array" });

    const { error: delError } = await supabaseAdmin
        .from('user_progress')
        .delete()
        .eq('user_id', req.user.id);

    if (delError) return res.status(500).json({ error: delError.message });

    if (lesson_ids.length === 0) return res.json({ success: true });

    const rows = lesson_ids.map(id => ({
        user_id: req.user!.id,
        lesson_id: id,
        completed_at: new Date().toISOString()
    }));

    const { error: insError } = await supabaseAdmin
        .from('user_progress')
        .insert(rows);

    if (insError) return res.status(500).json({ error: insError.message });
    return res.json({ success: true });
});

export default router;
