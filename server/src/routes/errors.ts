
import express, { Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { authenticateUser, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.post("/", async (req: AuthRequest, res: Response) => {
    const { message, stack, context, url, user_agent } = req.body;
    
    // Construct safe payload
    const logEntry: any = {
        message: message || "Unknown Error",
        stack: stack || null,
        context: context || null,
        url: url || null,
        user_agent: user_agent || null,
        created_at: new Date().toISOString()
    };

    // Only add user_id if it exists in request
    if (req.user?.id) {
        logEntry.user_id = req.user.id;
    }

    const { error } = await supabaseAdmin
        .from('error_logs')
        .insert(logEntry);

    if (error) {
        console.error("Failed to insert error log into Supabase:", error.message);
        return res.status(500).json({ error: error.message });
    }
    
    return res.json({ success: true });
});

export default router;
