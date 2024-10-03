import React, { useState } from "react";

import { useRouter } from "next/router";

import { notifications } from "@mantine/notifications";

import { useSessionContext } from "@/shared/components/wrappers/AppInitializer/AppInitializerContext";
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "@/shared/constants/app.constants";
import { useAppDispatch } from "@/shared/redux/hooks";
import { setUser } from "@/shared/redux/reducers/user.reducer";
import { useRegisterTeacherMutation } from "@/shared/redux/rtk-apis/auth/auth.api";
import {
  EUserRole,
  TTeacherRegistrationFields,
  TTokenizedUser,
} from "@/shared/redux/rtk-apis/auth/auth.types";

import TeacherRegistrationForm from "../../components/teacher/TeacherRegistrationForm";
import { APIError, UniqueCodeError } from "../../components/teacher/TeacherRegistrationForm.type";

const TeacherRegistrationContainer: React.FC = () => {
  const [registerTeacher] = useRegisterTeacherMutation();
  const [uniqueCodeError, setUniqueCodeError] = useState<UniqueCodeError | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { getMe } = useSessionContext();

  const handleSubmit = async (data: TTeacherRegistrationFields) => {
    const registrationData: TTeacherRegistrationFields = {
      ...data,
      userType: "teacher",
    };
    try {
      const result = await registerTeacher(registrationData).unwrap();
      const user: TTokenizedUser = {
        id: result.user.id,
        firstName: result.user.firstName,
        email: result.user.email,
        userType: result.user.userType as EUserRole,
      };
      dispatch(setUser(user));
      localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, result.token);
      await getMe().unwrap();
      notifications.show({
        title: "Success",
        message: "Teacher registration successful!",
        color: "blue",
      });
      setUniqueCodeError(null);
      router.push("/dashboard");
    } catch (error) {
      const apiError = error as APIError;
      if (apiError.data && apiError.data.message) {
        if (apiError.data.message.includes("unique code")) {
          setUniqueCodeError({
            message: apiError.data.message,
            remainingUses: apiError.data.remainingUses ?? 0,
            usageCount: apiError.data.usageCount ?? 0,
          });
        } else {
          setUniqueCodeError(null);
        }
      } else {
        setUniqueCodeError(null);
      }
      notifications.show({
        title: "Error",
        message: apiError.data.message,
        color: "red",
      });
    }
  };

  return (
    <div>
      <TeacherRegistrationForm onSubmit={handleSubmit} uniqueCodeError={uniqueCodeError} />
    </div>
  );
};

export default TeacherRegistrationContainer;
