import { useEffect } from "react";

import { TextInput, Select, PasswordInput, Button, Box, Group, Stack } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";

import { EEducationLevel } from "@/shared/typedefs";

import styles from "./StudentRegistraionForm.module.css";
import {
  CLASS_OPTIONS_COLLEGE,
  CLASS_OPTIONS_SCHOOL,
  DEGREE_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
} from "./StudentRegistrationForm.constants";
import {
  defaultValues,
  StudentRegistrationSchemaResolver,
} from "./StudentRegistrationForm.helpers";
import { IStudentRegistrationFormProps } from "./StudentRegistrationForm.type";
import { TStudentRegistrationFormData } from "./StudentRegistrationForm.types";

export function StudentRegistrationForm({ onSubmit }: IStudentRegistrationFormProps) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<TStudentRegistrationFormData>({
    resolver: StudentRegistrationSchemaResolver,
    defaultValues,
    mode: "onChange",
  });

  const educationLevel = watch("educationLevel");

  useEffect(() => {
    setValue("medium", "");
    setValue("class", "");
    setValue("degree", undefined);
    setValue("degreeName", "");
    setValue("semester", "");
  }, [educationLevel, setValue]);

  const handleReset = () => {
    reset({
      ...defaultValues,
    });
  };

  return (
    <div>
      <Box className={styles["container"]}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
          <div className={styles["title"]}>REGISTER AS A STUDENT</div>
          <Stack spacing="md">
            <div className={styles["group-name"]}>
              <div className={styles["fieldWrapper"]}>
                <TextInput
                  label="First Name"
                  withAsterisk
                  placeholder="Enter your first name"
                  classNames={{ input: styles["input"], label: styles["label"] }}
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
              </div>
              <div className={styles["fieldWrapper"]}>
                <TextInput
                  label="Last Name"
                  withAsterisk
                  placeholder="Enter your last name"
                  classNames={{ input: styles["input"], label: styles["label"] }}
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
              </div>
              <div className={styles["fieldWrapper"]}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Gender"
                      withAsterisk
                      placeholder="Select your gender"
                      classNames={{ input: styles["input"], label: styles["label"] }}
                      styles={{
                        input: {
                          color: "#333",
                        },
                        item: {
                          "&[data-selected]": {
                            color: "#333",
                          },
                        },
                      }}
                      data={["Male", "Female"]}
                      error={errors.gender?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className={styles["group-name"]}>
              <TextInput
                label="Address"
                withAsterisk
                placeholder="Enter your address"
                classNames={{
                  input: styles["input"],
                  label: styles["label"],
                  root: styles["addressField"],
                }}
                {...register("address")}
                error={errors.address?.message}
              />
              <TextInput
                label="Phone Number"
                withAsterisk
                placeholder="Enter your phone number"
                classNames={{
                  input: styles["input"],
                  label: styles["label"],
                  root: styles["phoneField"],
                }}
                {...register("phoneNo")}
                error={errors.phoneNo?.message}
              />
            </div>

            <Group grow align="flex-start">
              <Controller
                name="educationLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Education Level"
                    withAsterisk
                    placeholder="Select your education level"
                    classNames={{
                      input: styles["input"],
                      label: styles["label"],
                      item: styles["selectItem"],
                    }}
                    styles={{
                      input: {
                        color: "#333",
                      },
                      item: {
                        "&[data-selected]": {
                          color: "#333",
                        },
                      },
                    }}
                    data={EDUCATION_LEVEL_OPTIONS}
                    error={errors.educationLevel?.message}
                    {...field}
                    value={field.value || null}
                  />
                )}
              />
              {(educationLevel === EEducationLevel.SCHOOL ||
                educationLevel === EEducationLevel.COLLEGE) && (
                <Controller
                  name="medium"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="English/Bangla Medium"
                      withAsterisk
                      placeholder="Select medium"
                      classNames={{ input: styles["input"], label: styles["label"] }}
                      styles={{
                        input: {
                          color: "#333",
                        },
                        item: {
                          "&[data-selected]": {
                            color: "#333",
                          },
                        },
                      }}
                      data={[
                        { value: "english", label: "English" },
                        { value: "bangla", label: "Bangla" },
                      ]}
                      error={errors.medium?.message}
                      {...field}
                    />
                  )}
                />
              )}
              {educationLevel === EEducationLevel.UNIVERSITY && (
                <Controller
                  name="degree"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Degree Type"
                      withAsterisk
                      placeholder="Select degree type"
                      classNames={{ input: styles["input"], label: styles["label"] }}
                      styles={{
                        input: {
                          color: "#333",
                        },
                        item: {
                          "&[data-selected]": {
                            color: "#333",
                          },
                        },
                      }}
                      data={[
                        { value: "Bachelors", label: "Bachelors" },
                        { value: "Masters", label: "Masters" },
                      ]}
                      error={errors.degree?.message}
                      {...field}
                    />
                  )}
                />
              )}
            </Group>

            {(educationLevel === EEducationLevel.SCHOOL ||
              educationLevel === EEducationLevel.COLLEGE) && (
              <Controller
                name="class"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Class"
                    withAsterisk
                    placeholder="Select class"
                    classNames={{ input: styles["input"], label: styles["label"] }}
                    styles={{
                      input: {
                        color: "#333",
                      },
                      item: {
                        "&[data-selected]": {
                          color: "#333",
                        },
                      },
                    }}
                    data={
                      educationLevel === EEducationLevel.SCHOOL
                        ? CLASS_OPTIONS_SCHOOL
                        : CLASS_OPTIONS_COLLEGE
                    }
                    error={errors.class?.message}
                    {...field}
                  />
                )}
              />
            )}

            {educationLevel === EEducationLevel.UNIVERSITY && (
              <>
                <Controller
                  name="degreeName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Degree Name"
                      withAsterisk
                      placeholder="Select degree name"
                      classNames={{ input: styles["input"], label: styles["label"] }}
                      styles={{
                        input: {
                          color: "#333",
                        },
                        item: {
                          "&[data-selected]": {
                            color: "#333",
                          },
                        },
                      }}
                      data={DEGREE_OPTIONS}
                      error={errors.degreeName?.message}
                      {...field}
                    />
                  )}
                />
                <TextInput
                  label="Semester/Year"
                  withAsterisk
                  placeholder="Enter semester or year"
                  classNames={{ input: styles["input"], label: styles["label"] }}
                  {...register("semester")}
                  error={errors.semester?.message}
                />
              </>
            )}

            <TextInput
              label="Email"
              withAsterisk
              placeholder="Enter your email"
              classNames={{ input: styles["input"], label: styles["label"] }}
              {...register("email")}
              error={errors.email?.message}
            />

            <div className={styles["group-name"]}>
              <div className={styles["fieldWrapperPass"]}>
                <PasswordInput
                  label="Password"
                  withAsterisk
                  placeholder="Enter your password"
                  classNames={{ input: styles["input"], label: styles["label"] }}
                  {...register("password")}
                  error={errors.password?.message}
                />
              </div>
              <div className={styles["fieldWrapperPass"]}>
                <PasswordInput
                  label="Confirm Password"
                  withAsterisk
                  placeholder="Confirm your password"
                  classNames={{ input: styles["input"], label: styles["label"] }}
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>
          </Stack>

          <Group className={styles["buttonGroup"]}>
            <Button type="reset" className={styles["buttonReset"]} onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" className={styles["buttonSubmit"]} disabled={!isValid}>
              Register
            </Button>
          </Group>

          <Box className={styles["link"]}>
            Already have an account? <a href="/login">Login</a>
          </Box>
        </form>
      </Box>
    </div>
  );
}
