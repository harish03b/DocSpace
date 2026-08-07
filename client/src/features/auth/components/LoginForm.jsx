import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { authService } from "../index";
import { setToken } from "../../../utils/storage";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await authService.login(formData);

      // Temporary verification of the backend response.
      // Do not share the actual token if it appears here.
      console.log("LOGIN RESPONSE:", response);

      const token = response?.message?.token;

      if (!token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      setToken(token);

      navigate("/dashboard");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            width: "100%",
            borderRadius: 4,
            boxShadow: 5,
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    DocSpace
                  </Typography>

                  <Typography color="text.secondary">
                    Welcome Back
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error">
                    {error}
                  </Alert>
                )}

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <Typography
                  sx={{ textAlign: "center" }}
                  color="text.secondary"
                >
                  Don't have an account?
                </Typography>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginForm;