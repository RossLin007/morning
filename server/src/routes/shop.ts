
import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// 1. Get My Items
router.get("/items", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { data, error } = await supabaseAdmin
        .from('user_items')
        .select('item_id, purchase_date')
        .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

// 2. Buy Item
router.post("/buy", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { itemId, price } = req.body;

    // Check balance
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('coins')
        .eq('id', req.user.id)
        .single();

    if (!profile || profile.coins < price) {
        return res.status(400).json({ error: "Insufficient coins" });
    }

    // Transactional logic (simplified for Supabase REST API)
    // 1. Deduct coins
    const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ coins: profile.coins - price })
        .eq('id', req.user.id);

    if (updateError) return res.status(500).json({ error: updateError.message });

    // 2. Record purchase
    const { data, error } = await supabaseAdmin
        .from('user_items')
        .upsert({
            user_id: req.user.id,
            item_id: itemId,
            purchase_date: new Date().toISOString()
        })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

export default router;
