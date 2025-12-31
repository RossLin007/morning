
import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// 1. Find a potential partner
router.get("/find", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Exclude current relationships
    const { data: existing } = await supabaseAdmin
        .from('relationships')
        .select('user_id, partner_id')
        .or(`user_id.eq.${req.user.id},partner_id.eq.${req.user.id}`);
    
    const excludedIds = new Set([req.user.id]);
    existing?.forEach(r => {
        excludedIds.add(r.user_id);
        excludedIds.add(r.partner_id);
    });

    // Get candidate profiles
    const { data: profiles, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .neq('id', req.user.id)
        .limit(100);

    if (error) return res.status(500).json({ error: error.message });

    const candidates = (profiles || []).filter(p => !excludedIds.has(p.id));

    if (candidates.length === 0) {
        // Fallback to a system AI companion if no users found
        return res.json({
            id: 'ai_companion',
            name: 'AI 伴读 (系统)',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=zen',
            level: 99,
            is_ai: true
        });
    }

    // Return a random candidate
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    return res.json(random);
});

// 2. Create relationship (Pledge)
router.post("/connect", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { partner_id, type, sync_rate } = req.body;

    if (partner_id === 'ai_companion') {
        return res.json({ success: true, message: "Connected to AI" });
    }

    const { data, error } = await supabaseAdmin
        .from('relationships')
        .insert({
            user_id: req.user.id,
            partner_id,
            type,
            status: 'active',
            relation_days: 1,
            sync_rate
        })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

export default router;
