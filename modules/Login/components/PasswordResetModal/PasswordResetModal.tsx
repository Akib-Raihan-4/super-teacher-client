import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Group, Box, TextInput, Text, PasswordInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  useGenerateResetPasswordOtpMutation,
  useResetPasswordMutation,
  useValidateOtpMutation,
} from "@/shared/redux/rtk-apis/auth/auth.api";

import { ApiError } from "../../containers/LoginContainer.types";

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 characters long" }),
});

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type TEmailFormValues = z.infer<typeof emailSchema>;
type TOtpFormValues = z.infer<typeof otpSchema>;
type TPasswordFormValues = z.infer<typeof passwordSchema>;

interface IPasswordResetModalProps {
  opened: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<IPasswordResetModalProps> = ({ opened, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generateOtp, { isLoading: isGeneratingOtp }] = useGenerateResetPasswordOtpMutation();
  const [validateOtp, { isLoading: isValidatingOtp }] = useValidateOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<TEmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<TOtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<TPasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onEmailSubmit = async (data: TEmailFormValues) => {
    try {
      await generateOtp({ email: data.email }).unwrap();
      setEmail(data.email);
      setStep(2);
      showNotification({
        title: "Success",
        message: "OTP sent to your email",
        color: "blue",
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: (error as ApiError).data?.message || "Failed to send OTP",
        color: "red",
      });
    }
  };

  const onOtpSubmit = async (data: TOtpFormValues) => {
    try {
      const result = await validateOtp({ email, otp: data.otp }).unwrap();
      if (result.isValid) {
        setOtp(data.otp);
        setStep(3);
      } else {
        showNotification({
          title: "Error",
          message: "Invalid OTP",
          color: "red",
        });
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: (error as ApiError).data?.message || "Failed to validate OTP",
        color: "red",
      });
    }
  };

  const onPasswordSubmit = async (data: TPasswordFormValues) => {
    try {
      await resetPassword({
        email,
        otp,
        newPassword: data.newPassword,
      }).unwrap();
      showNotification({
        title: "Success",
        message: "Password reset successfully",
        color: "blue",
      });
      onClose();
    } catch (error) {
      showNotification({
        title: "Error",
        message: (error as ApiError).data?.message || "Failed to reset password",
        color: "red",
      });
    }
  };

  const handleCancel = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} size="md" centered>
      <Box mx="xl">
        <Text mb={20} fw={700} tt="uppercase" size="lg" c="#4CAF50">
          Reset Password
        </Text>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              error={emailErrors.email?.message}
              {...registerEmail("email")}
              styles={inputStyles}
            />
            <Group mt="xl" mb="sm">
              <Button size="sm" color="gray" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                style={formStyles.submitButton}
                loading={isGeneratingOtp}
              >
                Send OTP
              </Button>
            </Group>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)}>
            <TextInput
              label="OTP"
              placeholder="Enter the OTP sent to your email"
              error={otpErrors.otp?.message}
              {...registerOtp("otp")}
              styles={inputStyles}
            />
            <Group mt="xl" mb="sm">
              <Button size="sm" color="gray" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="submit"
                size="sm"
                style={formStyles.submitButton}
                loading={isValidatingOtp}
              >
                Verify OTP
              </Button>
            </Group>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              error={passwordErrors.newPassword?.message}
              {...registerPassword("newPassword")}
              styles={inputStyles}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm new password"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword("confirmPassword")}
              styles={inputStyles}
            />
            <Group mt="xl" mb="sm">
              <Button size="sm" color="gray" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                type="submit"
                size="sm"
                style={formStyles.submitButton}
                loading={isResettingPassword}
              >
                Reset Password
              </Button>
            </Group>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default PasswordResetModal;

const inputStyles = {
  label: { color: "#4CAF50" },
  input: { color: "#4CAF50" },
};

const formStyles = {
  title: {
    marginBottom: 20,
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: "lg",
    color: "#4CAF50",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
  },
};
