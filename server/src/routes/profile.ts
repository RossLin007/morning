
import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    console.log(`[Profile] Fetching profile for user ID: ${req.user.id}`);

    // 1. 尝试获取现有资料
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .maybeSingle();
    
    if (error) {
        console.error("[Profile] DB Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
    
    if (data) {
        console.log(`[Profile] Existing user found: ${data.name}`);
        return res.json(data);
    }

    // 2. 自动初始化：如果不存在则创建（这是解决你问题的关键）
    console.log(`[Profile] 🆕 No profile found. Auto-creating for UUID: ${req.user.id}`);
    
    const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
            id: req.user.id,
            name: req.user.email?.split('@')[0] || '新书友',
            avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${req.user.id}`,
            xp: 0,
            coins: 50,
            level: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (createError) {
        console.error("[Profile] ❌ Auto-creation failed:", createError.message);
        return res.status(500).json({ error: "Failed to initialize user profile in database" });
    }

    console.log(`[Profile] ✅ Successfully initialized user: ${newProfile.name}`);
    return res.json(newProfile);
});

router.put("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const updates = req.body;
    delete updates.id; 
    
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
            id: req.user.id,
            ...updates,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
});

// Reward 逻辑保持不变...
router.post("/reward", authenticateUser, async (req: AuthRequest, res: Response) => {
    // ...
});

export default router;
