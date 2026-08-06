import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

import { authService } from "../index";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      setError("");

      const response = await authService.login(formData);

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
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
                <Box textAlign="center">
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
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : "Login"}
                </Button>

                <Typography
                  textAlign="center"
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