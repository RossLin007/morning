import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

router.get("/sessions", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('*')
        .eq('user_id', req.user.id)
        .order('updated_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.post("/sessions", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { title = '新对话' } = req.body;
    const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .insert({ user_id: req.user.id, title })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.delete("/sessions/:id", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const { error } = await supabaseAdmin
        .from('chat_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
});

router.get("/sessions/:id/messages", authenticateUser, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
        .from('chat_messages')
        .select('*')
        .eq('session_id', id)
        .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.post("/sessions/:id/messages", authenticateUser, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { role, content, sources } = req.body;

    const { data, error } = await supabaseAdmin
        .from('chat_messages')
        .insert({ session_id: id, role, content, sources })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

router.put("/sessions/:id", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const { title } = req.body;

    const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

export default router;