import { useState } from "react";

import { useRouter } from "next/router";

import { notifications } from "@mantine/notifications";

import RegisterModal from "@/modules/Landing/components/RegisterModal/RegisterModal";
import { useSessionContext } from "@/shared/components/wrappers/AppInitializer/AppInitializerContext";
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "@/shared/constants/app.constants";
import { useAppDispatch } from "@/shared/redux/hooks";
import { setUser } from "@/shared/redux/reducers/user.reducer";
import { useRegisterStudentMutation } from "@/shared/redux/rtk-apis/auth/auth.api";
import {
  EUserRole,
  TStudentRegistrationFields,
  TTokenizedUser,
} from "@/shared/redux/rtk-apis/auth/auth.types";

import styles from "../../components/student/StudentRegistraionForm.module.css";
import { StudentRegistrationForm } from "../../components/student/StudentRegistrationForm";
import { TStudentRegistrationFormData } from "../../components/student/StudentRegistrationForm.types";
import { APIError } from "../../components/teacher/TeacherRegistrationForm.type";

export function StudentRegistrationContainer() {
  const [registerStudent] = useRegisterStudentMutation();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { getMe } = useSessionContext();

  const handleSubmit = async (data: TStudentRegistrationFormData) => {
    const registrationData: TStudentRegistrationFields = {
      ...data,
      userType: "student",
    };
    try {
      const result = await registerStudent(registrationData).unwrap();
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
        message: "Registration successful!",
        color: "blue",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error) {
      const apiError = error as APIError;
      notifications.show({
        title: "Error",
        message: apiError.data.message,
        color: "red",
      });
    }
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <div className={styles["formBody"]}>
      <StudentRegistrationForm onSubmit={handleSubmit} />
      <a className={styles["register"]} onClick={openRegisterModal}>
        Register
      </a>
      <RegisterModal opened={isRegisterModalOpen} close={closeRegisterModal} />
    </div>
  );
}
