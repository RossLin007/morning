import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { data, error } = await supabaseAdmin
        .from('user_tasks')
        .select('*')
        .eq('user_id', req.user.id)
        .gte('created_at', new Date().toISOString().split('T')[0]);

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.post("/:taskId/complete", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { taskId } = req.params;
    
    const { data, error } = await supabaseAdmin
        .from('user_tasks')
        .upsert({
            user_id: req.user.id,
            task_id: taskId,
            completed_at: new Date().toISOString(),
            status: 'completed'
        })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

export default router;