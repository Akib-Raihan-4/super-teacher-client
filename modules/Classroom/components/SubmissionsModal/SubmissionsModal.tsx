import { useState } from "react";

import {
  Modal,
  Card,
  Text,
  Group,
  ActionIcon,
  ScrollArea,
  Loader,
  Center,
  Badge,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { FaDownload } from "react-icons/fa";

import { useAppSelector } from "@/shared/redux/hooks";
import { selectAuthenticatedUser } from "@/shared/redux/reducers/user.reducer";
import {
  useGetAssignmentSubmissionsQuery,
  useGetSubmissionDownloadUrlQuery,
} from "@/shared/redux/rtk-apis/submissions/submissions.api";

import { ISubmissionsModalProps } from "./SubmissionsModal.interface";

const SubmissionsModal: React.FC<ISubmissionsModalProps> = ({
  opened,
  onClose,
  assignmentId,
  classroomId,
  dueDate,
}) => {
  const user = useAppSelector(selectAuthenticatedUser);
  const [activeSubmissionId, setActiveSubmissionId] = useState<number | null>(null);
  const {
    data: submissions,
    isLoading,
    isError,
  } = useGetAssignmentSubmissionsQuery(
    { classroomId, assignmentId },
    { skip: !classroomId || !assignmentId || !user.userId },
  );

  const {
    data: downloadUrl,
    isLoading: isDownloading,
    isError: downloadError,
  } = useGetSubmissionDownloadUrlQuery(
    { classroomId, submissionId: activeSubmissionId! },
    { skip: !activeSubmissionId },
  );

  const handleDownload = (submissionId: number) => {
    setActiveSubmissionId(submissionId);
  };

  if (isLoading) {
    return (
      <Modal opened={opened} onClose={onClose} centered>
        <Text mb={20} fw={700} tt="uppercase" size="lg" c="#4CAF50">
          Submissions
        </Text>
        <Center>
          <Loader />
        </Center>
      </Modal>
    );
  }

  if (isError) {
    showNotification({
      title: "Error",
      message: "Failed to load submissions",
      color: "red",
    });
    return (
      <Modal opened={opened} onClose={onClose} centered>
        <Text mb={20} fw={700} tt="uppercase" size="lg" c="#4CAF50">
          Submissions
        </Text>
        <Center>
          <Text color="red">Failed to load submissions</Text>
        </Center>
      </Modal>
    );
  }

  if (downloadUrl) {
    window.open(downloadUrl, "_blank");
    setActiveSubmissionId(null);
  }

  if (downloadError) {
    showNotification({
      title: "Error",
      message: "Failed to download file",
      color: "red",
    });
    setActiveSubmissionId(null);
  }

  return (
    <Modal opened={opened} onClose={onClose} centered size="md">
      <Text mb={20} fw={700} tt="uppercase" size="lg" c="#4CAF50">
        Submissions
      </Text>
      <ScrollArea>
        {submissions && submissions.length > 0 ? (
          submissions.map((submission) => {
            const isLate = new Date(submission.createdAt) > new Date(dueDate);
            return (
              <Card key={submission.submissionId} shadow="sm" p="lg" mb="sm">
                <Group position="apart" align="center">
                  <Text>
                    {submission.firstName} {submission.lastName}
                  </Text>
                  <Group>
                    {isLate && <Badge bg={"#FAF9F6"}>Late</Badge>}
                    <ActionIcon
                      onClick={() => handleDownload(submission.submissionId)}
                      title="Download"
                      disabled={isDownloading && activeSubmissionId === submission.submissionId}
                    >
                      {isDownloading && activeSubmissionId === submission.submissionId ? (
                        <Loader size="sm" />
                      ) : (
                        <FaDownload />
                      )}
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            );
          })
        ) : (
          <Center>
            <Text c={"#4CAF50"}>No submissions found.</Text>
          </Center>
        )}
      </ScrollArea>
    </Modal>
  );
};

export default SubmissionsModal;
