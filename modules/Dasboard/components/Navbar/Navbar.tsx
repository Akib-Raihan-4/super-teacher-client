import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { Anchor, Button, Group, Menu, Title } from "@mantine/core";
import { FaPlus } from "react-icons/fa6";

import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "@/shared/constants/app.constants";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { clearUser, selectAuthenticatedUser } from "@/shared/redux/reducers/user.reducer";
import projectApi from "@/shared/redux/rtk-apis/api.config";
import { EUserRole } from "@/shared/redux/rtk-apis/auth/auth.types";

import ClassroomFormModal from "../ClassroomFormModal/ClassroomFomModal";
import { useStyles } from "./Navbar.styles";

const Navbar = () => {
  const user = useAppSelector(selectAuthenticatedUser);
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(projectApi.util.resetApiState());
    dispatch(clearUser());
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
    router.push("/login");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Group className={classes.navbar}>
      <Anchor className={classes.logo} component={Link} href="/">
        <Title className={classes.logoTitle} order={4}>
          Superteacher
        </Title>
      </Anchor>

      <Group>
        <Anchor className={classes.dashboardLink} component={Link} href="/dashboard">
          <Title className={classes.dashboardTitle} order={5}>
            Dashboard
          </Title>
        </Anchor>
        {user?.userType === EUserRole.TEACHER && (
          <FaPlus color="white" style={{ cursor: "pointer" }} onClick={handleOpenModal} />
        )}
        <Menu
          shadow="xl"
          transitionProps={{ transition: "pop-top-right", duration: 200 }}
          withArrow
          offset={3}
          position="bottom-end"
        >
          <Menu.Target>
            <Button className={classes.userButton}>{user?.firstName || "User"}</Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => router.push("/profile")}>Profile</Menu.Item>
            <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <ClassroomFormModal opened={isModalOpen} onClose={handleCloseModal} />
    </Group>
  );
};

export default Navbar;
