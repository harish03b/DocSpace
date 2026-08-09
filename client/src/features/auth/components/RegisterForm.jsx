
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import authService from "../auth.service";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    const password =
      formData.password;

    if (!name || !email || !password) {
      setError(
        "Name, email and password are required."
      );

      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await authService.register({
          name,
          email,
          password,
        });

      console.log(
        "REGISTER RESPONSE:",
        response
      );

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 420,
        mx: "auto",
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Create Account
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Create your DocSpace account.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success">
            {success}
          </Alert>
        )}

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="name"
          disabled={loading}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="email"
          disabled={loading}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="new-password"
          disabled={loading}
          helperText="Password must be at least 6 characters."
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
        >
          {loading ? (
            <CircularProgress
              size={24}
              color="inherit"
            />
          ) : (
            "Create Account"
          )}
        </Button>

        <Typography
          align="center"
          color="text.secondary"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
};

export default RegisterForm;

