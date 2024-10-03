import React, { useState } from "react";

import { Button, Group, Box, Flex, Text, Grid, Anchor } from "@mantine/core";
import { useForm } from "react-hook-form";
import { MultiSelect, TextInput, Select, PasswordInput } from "react-hook-form-mantine";

import RegisterModal from "@/modules/Landing/components/RegisterModal/RegisterModal";

import {
  ITeacherFormValues,
  TeacherRegistrationFormInitialValues,
  TeacherRegistrationSchemaResolver,
} from "./TeacherRegistrationForm.helpers";
import { IExtendedTeacherRegistrationFormProps } from "./TeacherRegistrationForm.type";

export const Subjects = ["Physics", "Chemistry", "Math", "Geography", "Communication"];

const TeacherRegistrationForm: React.FC<IExtendedTeacherRegistrationFormProps> = ({
  onSubmit,
  uniqueCodeError,
}) => {
  const {
    formState: { errors, isValid },
    handleSubmit,
    control,
    reset,
  } = useForm<ITeacherFormValues>({
    defaultValues: TeacherRegistrationFormInitialValues,
    resolver: TeacherRegistrationSchemaResolver,
    mode: "onChange",
  });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const getUniqueCodeError = () => {
    if (errors.uniqueCode) {
      return errors.uniqueCode.message;
    }
    if (uniqueCodeError) {
      return `${uniqueCodeError.message}. Remaining: ${uniqueCodeError.remainingUses}`;
    }
    return undefined;
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <Flex justify="center" align="center" direction="column" style={{ minHeight: "100vh" }}>
      <Text my={"2.5rem"} align="center" fw={700} c="#4CAF50" size={"2rem"}>
        REGISTER AS TEACHER
      </Text>
      <Box maw={700}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid gutter={"md"} grow>
            <Grid.Col>
              <TextInput
                size={"md"}
                label="Enter registration code"
                placeholder="Enter unique code"
                withAsterisk
                control={control}
                name="uniqueCode"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={getUniqueCodeError()}
              />
            </Grid.Col>

            <Grid.Col xs={6} md={4}>
              <TextInput
                size={"md"}
                label="First name"
                placeholder="Enter your first name"
                withAsterisk
                control={control}
                name="firstName"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={errors.firstName?.message}
              />
            </Grid.Col>

            <Grid.Col xs={6} md={4}>
              <TextInput
                size={"md"}
                label="Last name"
                color=""
                placeholder="Enter your last name"
                withAsterisk
                control={control}
                name="lastName"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={errors.lastName?.message}
              />
            </Grid.Col>

            <Grid.Col md={4}>
              <Select
                size="md"
                label="Gender"
                placeholder="Select your gender"
                withAsterisk
                data={["Male", "Female"]}
                control={control}
                name="gender"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={errors.gender?.message}
              />
            </Grid.Col>

            <Grid.Col sm={8}>
              <TextInput
                size={"md"}
                label="Major Subject"
                placeholder="Enter your field of specialization"
                withAsterisk
                control={control}
                name="majorSubject"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={errors.majorSubject?.message}
              />
            </Grid.Col>

            <Grid.Col xs={4}>
              <Select
                size="md"
                label="Highest Education Level"
                placeholder="Select education level"
                withAsterisk
                data={["Bachelors", "Masters", "Diploma", "PhD"]}
                control={control}
                name="highestEducationLevel"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={errors.highestEducationLevel?.message}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <MultiSelect
                size="md"
                label="Subjects to teach"
                placeholder="Pick your preferred subjects"
                withAsterisk
                searchable
                data={Subjects}
                control={control}
                name="subjectsToTeach"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={errors.subjectsToTeach?.message}
              />
            </Grid.Col>

            <Grid.Col xs={12}>
              <TextInput
                size={"md"}
                label="Email"
                placeholder="Enter your email"
                withAsterisk
                control={control}
                name="email"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={errors.email?.message}
              />
            </Grid.Col>

            <Grid.Col xs={6}>
              <PasswordInput
                size="md"
                label="Password"
                placeholder="Enter your password"
                withAsterisk
                control={control}
                name="password"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={errors.password?.message}
              />
            </Grid.Col>

            <Grid.Col xs={6}>
              <PasswordInput
                size="md"
                label="Confirm Password"
                placeholder="Confirm password"
                withAsterisk
                control={control}
                name="confirmPassword"
                styles={{
                  label: {
                    color: "#4CAF50",
                  },
                }}
                error={errors.confirmPassword?.message}
              />
            </Grid.Col>
          </Grid>

          <Group
            position="center"
            mt="lg"
            pt="sm"
            sx={{
              "@media (min-width: 1024px)": {
                gap: "15rem",
              },
              "@media (min-width: 768px) and (max-width: 1023px)": {
                gap: "10rem",
              },
              "@media (max-width: 767px)": {
                gap: "2rem",
              },
            }}
          >
            <Button size="sm" style={{ background: "#9e9e9e" }} onClick={() => reset()}>
              Reset
            </Button>
            <Button
              type="submit"
              size="sm"
              style={{
                background: isValid ? "#4caf50" : "#f5f5f5",
                color: isValid ? "white" : "#9e9e9e",
              }}
              disabled={!isValid}
            >
              Submit
            </Button>
          </Group>
        </form>

        <Text fw={400} c="#4CAF50" ta={"center"} size="md" mt={"lg"}>
          Already have an account?{" "}
          <Anchor c="white" href="/login">
            Login
          </Anchor>
        </Text>

        <Text fw={400} c="#4CAF50" ta={"center"} size="md">
          <Anchor c="white" onClick={openRegisterModal}>
            Register
          </Anchor>
        </Text>
        <RegisterModal opened={isRegisterModalOpen} close={closeRegisterModal} />
      </Box>
    </Flex>
  );
};

export default TeacherRegistrationForm;
