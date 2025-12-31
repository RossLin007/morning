import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    const { from = 0, to = 9 } = req.query;
    const { data, error } = await supabaseAdmin
        .from('posts')
        .select(`*, user:profiles!user_id(*)`)
        .range(Number(from), Number(to))
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { content, image_url } = req.body;
    const { data, error } = await supabaseAdmin
        .from('posts')
        .insert({ user_id: req.user.id, content, image_url })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.post("/:id/like", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const userId = req.user.id;

    const { data: existing } = await supabaseAdmin
        .from('post_likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', userId)
        .maybeSingle();

    if (existing) {
        await supabaseAdmin.from('post_likes').delete().eq('id', existing.id);
        return res.json({ success: true, liked: false });
    } else {
        await supabaseAdmin.from('post_likes').insert({ post_id: id, user_id: userId });
        return res.json({ success: true, liked: true });
    }
});

export default router;