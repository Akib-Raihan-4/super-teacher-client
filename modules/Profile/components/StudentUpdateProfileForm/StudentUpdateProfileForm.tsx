import React, { useEffect, useState } from "react";

import { Button, Grid, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Form, FormSubmitHandler, useForm } from "react-hook-form";
import { TextInput, Select } from "react-hook-form-mantine";

import {
  CLASS_OPTIONS_COLLEGE,
  CLASS_OPTIONS_SCHOOL,
  DEGREE_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
} from "@/modules/Registration/components/student/StudentRegistrationForm.constants";
import { useEditUserMutation } from "@/shared/redux/rtk-apis/users/users.api";

import {
  StudentProfileFormValues,
  getDefaultValues,
  UserUpdateDTO,
  createUserUpdateDTO,
  studentUpdateProfileFormResolver,
} from "./StudentUpdateProfileForm.helpers";
import { IStudentUpdateProfileFormProps } from "./StudentUpdateProfileForm.interface";
import { useStyles, inputProps } from "./StudentUpdateProfileForm.styles";

const StudentUpdateProfileForm: React.FC<IStudentUpdateProfileFormProps> = ({ user, onClose }) => {
  const { classes } = useStyles();
  const [editUser] = useEditUserMutation();
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [educationLevelKey, setEducationLevelKey] = useState(0);

  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<StudentProfileFormValues>({
    defaultValues: getDefaultValues(user),
    resolver: studentUpdateProfileFormResolver,
    mode: "onChange",
  });

  const educationLevel = watch("educationLevel");

  useEffect(() => {
    const initialEducationLevel = user.student?.educationLevel;
    const clearEducationFields = () => {
      setValue("medium", "");
      setValue("class", "");
      setValue("degree", "");
      setValue("degreeName", "");
      setValue("semester", "");
    };

    if (educationLevel !== initialEducationLevel) {
      clearEducationFields();
      setIsFormTouched(true);
      setEducationLevelKey((prevKey) => prevKey + 1);
    }
  }, [educationLevel, user.student?.educationLevel, setValue]);

  useEffect(() => {
    if (isDirty) {
      setIsFormTouched(true);
    }
  }, [isDirty]);

  const onSubmit: FormSubmitHandler<StudentProfileFormValues> = async (formData) => {
    try {
      const editUserData: UserUpdateDTO = createUserUpdateDTO(formData.data);
      await editUser(editUserData).unwrap();

      notifications.show({
        color: "blue",
        title: "Success",
        message: "Profile updated successfully",
      });
      onClose();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to update profile",
      });
    }
  };

  const handleReset = () => {
    reset(getDefaultValues(user));
    setIsFormTouched(false);
    setEducationLevelKey((prevKey) => prevKey + 1);
  };

  const renderAdditionalFields = () => {
    if (educationLevel === "school" || educationLevel === "college") {
      return (
        <React.Fragment key={`${educationLevel}-${educationLevelKey}`}>
          <Grid.Col xs={12} sm={6}>
            <Select
              {...inputProps}
              label="Medium"
              placeholder="Select medium"
              withAsterisk
              data={[
                { value: "english", label: "English" },
                { value: "bangla", label: "Bangla" },
              ]}
              control={control}
              name="medium"
              error={errors.medium?.message}
              classNames={{ root: classes.select, label: classes.inputLabel }}
            />
          </Grid.Col>
          <Grid.Col xs={12} sm={6}>
            <Select
              {...inputProps}
              label="Class"
              placeholder="Select class"
              withAsterisk
              data={educationLevel === "school" ? CLASS_OPTIONS_SCHOOL : CLASS_OPTIONS_COLLEGE}
              control={control}
              name="class"
              error={errors.class?.message}
              classNames={{ root: classes.select, label: classes.inputLabel }}
            />
          </Grid.Col>
        </React.Fragment>
      );
    }

    if (educationLevel === "university") {
      return (
        <React.Fragment key={`${educationLevel}-${educationLevelKey}`}>
          <Grid.Col xs={12} sm={6}>
            <Select
              {...inputProps}
              label="Degree"
              placeholder="Select degree"
              withAsterisk
              data={[
                { value: "Bachelors", label: "Bachelors" },
                { value: "Masters", label: "Masters" },
              ]}
              control={control}
              name="degree"
              error={errors.degree?.message}
              classNames={{ root: classes.select, label: classes.inputLabel }}
            />
          </Grid.Col>
          <Grid.Col xs={12} sm={6}>
            <Select
              {...inputProps}
              data={DEGREE_OPTIONS}
              label="Degree Name"
              placeholder="Select degree name"
              withAsterisk
              control={control}
              name="degreeName"
              error={errors.degreeName?.message}
              classNames={{ root: classes.select, label: classes.inputLabel }}
            />
          </Grid.Col>
          <Grid.Col xs={12} sm={6}>
            <TextInput
              {...inputProps}
              label="Semester/Year"
              placeholder="Enter semester or year"
              withAsterisk
              control={control}
              name="semester"
              error={errors.semester?.message}
              classNames={{ label: classes.inputLabel }}
            />
          </Grid.Col>
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <Form control={control} onSubmit={onSubmit} className={classes.form}>
      <Grid gutter="xl">
        <Grid.Col xs={12} sm={6}>
          <TextInput
            {...inputProps}
            disabled
            label="Email"
            placeholder="Enter your email"
            withAsterisk
            control={control}
            name="email"
            classNames={{ label: classes.inputLabel }}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          <Select
            {...inputProps}
            label="Gender"
            placeholder="Select your gender"
            withAsterisk
            data={["Male", "Female"]}
            control={control}
            name="gender"
            error={errors.gender?.message}
            classNames={{ root: classes.select, label: classes.inputLabel }}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          <TextInput
            {...inputProps}
            label="First name"
            placeholder="Enter your first name"
            withAsterisk
            control={control}
            name="firstName"
            error={errors.firstName?.message}
            classNames={{ label: classes.inputLabel }}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          <TextInput
            {...inputProps}
            label="Last name"
            placeholder="Enter your last name"
            withAsterisk
            control={control}
            name="lastName"
            error={errors.lastName?.message}
            classNames={{ label: classes.inputLabel }}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          <TextInput
            {...inputProps}
            label="Address"
            placeholder="Enter your address"
            withAsterisk
            control={control}
            name="address"
            error={errors.address?.message}
            classNames={{ label: classes.inputLabel }}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          <TextInput
            {...inputProps}
            label="Phone number"
            placeholder="Enter your phone number"
            withAsterisk
            control={control}
            name="phoneNo"
            error={errors.phoneNo?.message}
            classNames={{ label: classes.inputLabel }}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          <Select
            {...inputProps}
            label="Education level"
            placeholder="Select your education level"
            withAsterisk
            data={EDUCATION_LEVEL_OPTIONS}
            control={control}
            name="educationLevel"
            error={errors.educationLevel?.message}
            classNames={{ root: classes.select, label: classes.inputLabel }}
          />
        </Grid.Col>
        {renderAdditionalFields()}
      </Grid>
      <Group position="center" mt="lg" pt="sm" className={classes.buttonGroup}>
        <Button size="sm" className={classes.resetButton} onClick={handleReset}>
          Reset
        </Button>
        <Button
          type="submit"
          size="sm"
          className={classes.submitButton}
          disabled={!isValid || !isFormTouched}
        >
          Submit
        </Button>
      </Group>
    </Form>
  );
};

export default StudentUpdateProfileForm;
