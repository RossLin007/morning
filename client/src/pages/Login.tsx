import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { uniauth } from "@/lib/uniauth";
import { useToast } from "@/contexts/ToastContext";
import { phoneLoginSchema, PhoneLoginForm } from "@/lib/validations";
import { useTranslation } from "@/hooks/useTranslation";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [shakeAgreement, setShakeAgreement] = useState(false);

  // MFA state
  const [showMfaInput, setShowMfaInput] = useState(false);
  const [mfaToken, setMfaToken] = useState<string>("");
  const [mfaCode, setMfaCode] = useState("");

  // Phone Form
  const phoneForm = useForm<PhoneLoginForm>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: "", code: "" },
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    const phone = phoneForm.getValues("phone");
    const phoneResult = await phoneLoginSchema
      .pick({ phone: true })
      .safeParseAsync({ phone });

    if (!phoneResult.success) {
      showToast(phoneResult.error.issues[0].message, "error");
      return;
    }

    if (countdown > 0) return;

    setLoading(true);
    try {
      const result = await uniauth.sendCode(`+86${phone}`);
      setCountdown(result.retry_after || 60);
      showToast(t("login.toast.code_sent"), "success");
    } catch (error: any) {
      console.error("[Debug] SendCode Error Object:", error);
      
      // 1. Try to extract from UniAuth standard error structure
      let apiError = error?.response?.data?.error?.message 
                  || error?.response?.data?.message 
                  || error?.message;
      
      // 2. Fallback for non-response errors
      if (!apiError && typeof error === 'string') apiError = error;

      if (apiError?.includes("placeholder") || apiError?.includes("configured")) {
        showToast("需配置短信服务商 (模拟发送成功)", "info");
        setCountdown(60);
      } else {
        showToast(apiError || "发送验证码失败", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      showToast("请输入6位验证码", "error");
      return;
    }

    setLoading(true);
    try {
      await uniauth.verifyMFA(mfaToken, mfaCode);
      // Refresh user info in AuthContext after successful MFA
      await refreshUser();
      showToast("登录成功", "success");
      navigate("/");
    } catch (error: any) {
      const apiError = error?.response?.data?.error?.message || error?.message;
      showToast(apiError || "MFA 验证失败", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PhoneLoginForm) => {
    if (!agreed) {
      setShakeAgreement(true);
      setTimeout(() => setShakeAgreement(false), 500);
      showToast(t("login.agreement.error"), "error");
      return;
    }

    setLoading(true);
    try {
      const { phone, code } = data;
      const result = await uniauth.loginWithCode(`+86${phone}`, code);

      // Check for MFA requirement
      if (result.mfa_required && result.mfa_token) {
        setMfaToken(result.mfa_token);
        setShowMfaInput(true);
        showToast("需要二次验证", "info");
        return;
      }

      // Refresh user info in AuthContext after successful login
      await refreshUser();
      showToast("登录成功", "success");
      navigate("/");
    } catch (error: any) {
      const apiError = error?.response?.data?.error?.message || error?.message;
      if (apiError?.includes("placeholder")) {
        showToast("演示模式: 请配置真实 UniAuth 密钥", "info");
      } else {
        showToast(apiError || "登录失败", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // MFA Input Modal
  if (showMfaInput) {
    return (
      <div className="min-h-screen relative bg-white dark:bg-[#0A0A0A] font-sans overflow-hidden flex flex-col items-center justify-center p-6 transition-colors">
        <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="size-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-primary/30 mb-6 rotate-3">
              <Icon name="security" className="text-white text-3xl" filled />
            </div>
            <h1 className="text-2xl font-display font-bold text-text-main dark:text-white mb-2 tracking-tight">
              二次验证
            </h1>
            <p className="text-gray-400 text-sm">
              请输入您的身份验证器应用中的验证码
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <InputGroup
              icon="pin"
              type="text"
              placeholder="请输入6位验证码"
              value={mfaCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMfaCode(e.target.value)}
              maxLength={6}
            />
            <Button
              type="button"
              isLoading={loading}
              fullWidth
              onClick={handleMfaVerify}
            >
              验证
            </Button>
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => {
                setShowMfaInput(false);
                setMfaToken("");
                setMfaCode("");
              }}
            >
              返回登录
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-white dark:bg-[#0A0A0A] font-sans overflow-hidden flex flex-col items-center justify-center p-6 transition-colors">
      <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="size-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-primary/30 mb-6 rotate-3">
            <Icon name="spa" className="text-white text-3xl" filled />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-main dark:text-white mb-2 tracking-tight">
            {t("login.app_name")}
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            {t("login.slogan")}
          </p>
        </div>

        <form
          onSubmit={phoneForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <InputGroup
            icon="smartphone"
            prefix="+86"
            type="tel"
            placeholder={t("login.input.phone")}
            register={phoneForm.register("phone")}
            error={phoneForm.formState.errors.phone?.message}
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <InputGroup
                icon="sms"
                type="text"
                placeholder={t("login.input.code")}
                register={phoneForm.register("code")}
                error={phoneForm.formState.errors.code?.message}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleSendCode}
              disabled={countdown > 0 || loading}
              className="w-[100px] shrink-0"
            >
              {countdown > 0 ? `${countdown}s` : t("login.input.get_code")}
            </Button>
          </div>
          <Button
            type="submit"
            isLoading={loading}
            fullWidth
            className="mt-2"
          >
            {t("login.btn.login_register")}
          </Button>
        </form>

        <div
          className={`mt-6 flex items-start gap-2 px-1 transition-transform ${shakeAgreement ? "animate-[shake_0.5s_ease-in-out]" : ""
            }`}
        >
          <div className="relative flex items-center pt-0.5">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer size-4 appearance-none rounded border border-gray-300 dark:border-gray-600 checked:bg-primary checked:border-primary transition-colors cursor-pointer"
            />
            <Icon
              name="check"
              className="absolute top-0.5 left-0 text-white text-xs pointer-events-none opacity-0 peer-checked:opacity-100 peer-checked:top-[2px] peer-checked:left-[1px]"
            />
          </div>
          <label
            htmlFor="agreement"
            className="text-[10px] text-gray-400 leading-tight select-none cursor-pointer"
          >
            {t("login.agreement.prefix")}{" "}
            <span className="text-primary hover:underline">
              {t("login.agreement.user_ag")}
            </span>{" "}
            与{" "}
            <span className="text-primary hover:underline">
              {t("login.agreement.privacy")}
            </span>
          </label>
        </div>

        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={() => navigate("/")}
          className="mt-8 text-xs text-gray-300 hover:text-primary"
        >
          {t("login.btn.guest")} &rarr;
        </Button>
      </div>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }`}</style>
    </div>
  );
};

interface InputGroupProps {
  icon: string;
  type: string;
  placeholder: string;
  register?: ReturnType<typeof useForm>['register'] extends (name: string) => infer R ? R : never;
  error?: string;
  prefix?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

const InputGroup: React.FC<InputGroupProps> = ({
  icon,
  type,
  placeholder,
  register,
  error,
  prefix,
  value,
  onChange,
  maxLength,
}) => (
  <div className="relative group">
    <Icon
      name={icon}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10"
    />
    {prefix && (
      <>
        <div className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs z-10">
          {prefix}
        </div>
        <div className="absolute left-16 top-1/2 -translate-y-1/2 w-[1px] h-4 bg-gray-200 dark:bg-gray-700 z-10"></div>
      </>
    )}
    <input
      {...(register || {})}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className={`w-full bg-gray-50 dark:bg-[#151515] border ${error ? "border-red-500" : "border-gray-200 dark:border-gray-800"
        } rounded-2xl py-4 ${prefix ? "pl-20" : "pl-12"
        } pr-4 text-sm outline-none focus:border-primary transition-colors text-text-main dark:text-white font-medium`}
    />
    {error && (
      <span className="text-[10px] text-red-500 absolute -bottom-4 left-2">
        {error}
      </span>
    )}
  </div>
);
