import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { authenticateUser, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { data, error } = await supabaseAdmin
        .from('relationships')
        .select(`*, partner_profile:partner_id(*), user_profile:user_id(*)`)
        .or(`user_id.eq.${req.user.id},partner_id.eq.${req.user.id}`);

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.get("/:id/logs", authenticateUser, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
        .from('relation_logs')
        .select('*')
        .eq('relationship_id', id)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.post("/:id/water", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const { currentLevel } = req.body;

    await supabaseAdmin.from('relation_logs').insert({
        relationship_id: id,
        actor_id: req.user.id,
        type: 'water',
        content: '为共修树浇了水'
    });

    const { data, error } = await supabaseAdmin
        .from('relationships')
        .update({ 
            tree_level: currentLevel + 1,
            last_interaction: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.post("/:id/messages", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const { content, type } = req.body;

    const { data, error } = await supabaseAdmin.from('relation_logs').insert({
        relationship_id: id,
        actor_id: req.user.id,
        type: type || 'interaction',
        content
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

export default router;