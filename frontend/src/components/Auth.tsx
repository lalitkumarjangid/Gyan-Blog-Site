import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@lalitdev/blog-zodauth";
import axios from "axios";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });

  async function sendRequest() {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const jwt = response.data;
      localStorage.setItem("token", jwt);
      toast.success(
        `Successfully ${type === "signup" ? "signed up" : "signed in"}!`
      );
      navigate("/blogs");
    } catch (e) {
      toast.error(
        `Error while ${type === "signup" ? "signing up" : "signing in"}`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 antialiased">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-blue-200 to-slate-200 tracking-tight">
            {type === "signup" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-slate-400 font-medium">
            {type === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
            <Link
              className="ml-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
              to={type === "signin" ? "/signup" : "/signin"}
            >
              {type === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>

        <div className="space-y-6">
          {type === "signup" && (
            <LabelledInput
              label="Name"
              placeholder="Enter your name"
              onChange={(e) =>
                setPostInputs({ ...postInputs, name: e.target.value })
              }
            />
          )}
          <LabelledInput
            label="Email"
            placeholder="you@example.com"
            onChange={(e) =>
              setPostInputs({ ...postInputs, username: e.target.value })
            }
            type="email"
          />
          <LabelledInput
            label="Password"
            type="password"
            placeholder="••••••••"
            onChange={(e) =>
              setPostInputs({ ...postInputs, password: e.target.value })
            }
          />

          <button
            onClick={sendRequest}
            disabled={isLoading}
            className="w-full relative inline-flex h-12 overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 group hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#60a5fa_50%,#3b82f6_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-1 text-base font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-800">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Loading...</span>
                </div>
              ) : type === "signup" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white 
                placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                transition-all duration-200 hover:bg-slate-900/70"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
