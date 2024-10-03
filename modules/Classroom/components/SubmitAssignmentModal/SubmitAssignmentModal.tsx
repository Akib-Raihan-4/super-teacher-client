import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Group, FileInput, Box, TextInput, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm, Controller } from "react-hook-form";

import { ApiError } from "@/modules/Login/containers/LoginContainer.types";
import { useSubmitAssignmentMutation } from "@/shared/redux/rtk-apis/submissions/submissions.api";

import {
  acceptedFileTypesString,
  assignmentSubmissionSchema,
  TAssignmentSubmissionValues,
} from "./SubmitAssignmentModal.helpers";
import { IAssignmentSubmissionModalProps } from "./SubmitAssignmentModal.interface";
import { inputStyles, formStyles } from "./SubmitAssignmentModal.styles";

const SubmitAssignmentModal: React.FC<IAssignmentSubmissionModalProps> = ({
  opened,
  onClose,
  assignmentId,
  classroomId,
  userId,
}) => {
  const [submitAssignment, { isLoading }] = useSubmitAssignmentMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TAssignmentSubmissionValues>({
    resolver: zodResolver(assignmentSubmissionSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: TAssignmentSubmissionValues) => {
    try {
      await submitAssignment({
        classroomId,
        assignmentId,
        userId,
        file: data.file,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Assignment submitted successfully",
        color: "blue",
      });

      reset();
      onClose();
    } catch (error) {
      showNotification({
        title: "Error",
        message: (error as ApiError).data?.message,
        color: "red",
      });
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} size="md" centered>
      <Box mx="xl">
        <Text mb={20} fw={700} tt="uppercase" size="lg" c="#4CAF50">
          Submit Assignment
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="file"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <Box>
                <TextInput
                  size="md"
                  label="Upload file"
                  placeholder="Select a file"
                  value={value?.name || ""}
                  onClick={() => document.getElementById("hidden-file-input")?.click()}
                  readOnly
                  error={errors.file?.message}
                  styles={inputStyles}
                />
                <FileInput
                  id="hidden-file-input"
                  style={{ display: "none" }}
                  accept={acceptedFileTypesString}
                  onChange={(file) => onChange(file)}
                  {...rest}
                />
              </Box>
            )}
          />
          <Group mt="xl" mb="sm">
            <Button size="sm" color="gray" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" size="sm" style={formStyles.submitButton} loading={isLoading}>
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </Modal>
  );
};

export default SubmitAssignmentModal;
