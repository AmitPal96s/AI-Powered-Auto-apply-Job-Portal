import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

void motion;
import toast from "react-hot-toast";
import { loginUser } from "../../services/auth/authService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const userData = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });
      login(userData);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Login</h2>
          <p className="text-sm text-gray-500">
            Continue to your personalized job dashboard.
          </p>
        </div>

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}

export default Login;
