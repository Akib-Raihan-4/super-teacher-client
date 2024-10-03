import { useState } from "react";

import { SimpleGrid, Flex, Text, Group, ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FaRegTrashAlt } from "react-icons/fa";

import { useAppSelector } from "@/shared/redux/hooks";
import { selectAuthenticatedUser } from "@/shared/redux/reducers/user.reducer";
import { EUserRole } from "@/shared/redux/rtk-apis/auth/auth.types";
import { useUnenrollStudentMutation } from "@/shared/redux/rtk-apis/enrollments/enrollments.api";

import ConfirmUnenrollModal from "../ConfirmUnenrollModal/ConfirmUnenrollModal";
import { StudentListProps } from "./StudentList.interface";

const StudentList: React.FC<StudentListProps> = ({ students, classroomId }) => {
  const [unenrollStudent] = useUnenrollStudentMutation();
  const user = useAppSelector(selectAuthenticatedUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null);

  const handleUnenroll = async () => {
    if (selectedStudent !== null) {
      try {
        await unenrollStudent({ studentId: selectedStudent.id, classroomId }).unwrap();
        notifications.show({
          title: "Success",
          message: `Student successfully unenrolled from classroom`,
          color: "blue",
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to unenroll student. Please try again.",
          color: "red",
        });
      } finally {
        setIsModalOpen(false);
        setSelectedStudent(null);
      }
    }
  };

  return (
    <>
      <SimpleGrid>
        {students.map((student) => (
          <Flex key={student.id} justify="space-between">
            <Text c={"white"}>
              {student.firstName} {student.lastName}
              {user?.userType === EUserRole.STUDENT && student.userId === user.userId && (
                <Text span c="dimmed">
                  {" "}
                  (you)
                </Text>
              )}
            </Text>
            <Group>
              <Text c={"white"}>{student.email}</Text>
              {user?.userType === EUserRole.TEACHER && (
                <ActionIcon
                  variant="subtle"
                  onClick={() => {
                    setSelectedStudent({
                      id: student.id,
                      name: `${student.firstName} ${student.lastName}`,
                    });
                    setIsModalOpen(true);
                  }}
                  sx={(theme) => ({
                    color: "white",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: theme.colors.red[6],
                    },
                  })}
                >
                  <FaRegTrashAlt />
                </ActionIcon>
              )}
            </Group>
          </Flex>
        ))}
      </SimpleGrid>

      {selectedStudent && (
        <ConfirmUnenrollModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleUnenroll}
          studentName={selectedStudent.name}
        />
      )}
    </>
  );
};

export default StudentList;
