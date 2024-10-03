import { useState, useEffect } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  Box,
  Text,
  SimpleGrid,
  TextInput,
  Textarea,
  FileInput,
  Button,
  Group,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { Controller, useForm } from "react-hook-form";

import {
  useCreateAssignmentMutation,
  useGetAssignmentDownloadUrlQuery,
  useUpdateAssignmentMutation,
} from "@/shared/redux/rtk-apis/assignments/assignments.api";
import { getFileName } from "@/shared/utils/getFileName";

import {
  acceptedFileTypesString,
  assignmentFormSchema,
  assignmentFormSchemaEdit,
  TAssignmentFormValues,
} from "./CreateAssignmentFormModal.helpers";
import { IAssignmentFormModalProps } from "./CreateAssignmentFormModal.interface";
import { formStyles, inputStyles } from "./CreateAssignmentFormModal.styles";

const CreateAssignmentFormModal: React.FC<IAssignmentFormModalProps> = ({
  opened,
  onClose,
  classroomId,
  assignment,
}) => {
  const isUpdateAssignment = Boolean(assignment);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
  } = useForm<TAssignmentFormValues>({
    resolver: zodResolver(isUpdateAssignment ? assignmentFormSchemaEdit : assignmentFormSchema),
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [createAssignment] = useCreateAssignmentMutation();
  const [updateAssignment] = useUpdateAssignmentMutation();

  const watchFile = watch("file");

  useEffect(() => {
    if (opened && assignment) {
      reset({
        title: assignment.title,
        description: assignment.description,
        dueDate: new Date(assignment.dueDate),
      });
      setFilePreview(null);
    } else if (opened) {
      reset({
        title: "",
        description: "",
        dueDate: undefined,
      });
      setFilePreview(null);
    }
  }, [opened, assignment, reset]);

  const onSubmit = async (data: TAssignmentFormValues) => {
    setIsLoading(true);
    try {
      if (isUpdateAssignment) {
        await updateAssignment({
          classroomId: classroomId,
          assignmentId: assignment!.id,
          data: {
            file: data.file,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
          },
        }).unwrap();

        showNotification({
          title: "Success",
          message: "Assignment updated successfully!",
          color: "blue",
        });
      } else {
        await createAssignment({
          classroomId,
          data: {
            file: data.file,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
          },
        }).unwrap();

        showNotification({
          title: "Success",
          message: "Assignment created successfully!",
          color: "blue",
        });
      }

      onClose();
    } catch (error) {
      showNotification({
        title: isUpdateAssignment ? "Update failed" : "Creation failed",
        message: isUpdateAssignment ? "Failed to update assignment" : "Failed to create assignment",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFilePreview(fileURL);
    } else {
      setFilePreview(null);
    }
  };

  const { data: downloadUrl } = useGetAssignmentDownloadUrlQuery(
    {
      classroomId,
      assignmentId: assignment?.id || 0,
    },
    {
      skip: !assignment,
    },
  );

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    } else {
      console.error("Download URL is undefined");
    }
  };

  return (
    <Modal opened={opened} onClose={handleCancel} size="md" centered>
      <Box mx="xl">
        <Text mb={20} fw={700} tt="uppercase" size="lg" c="#4CAF50">
          {isUpdateAssignment ? "Edit Assignment" : "Create Assignment"}
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid>
            <TextInput
              size="md"
              label="Title"
              placeholder="Enter a title"
              error={errors.title?.message}
              styles={inputStyles}
              {...register("title")}
            />
            <Textarea
              size="md"
              label="Description"
              placeholder="Enter a description"
              error={errors.description?.message}
              styles={inputStyles}
              {...register("description")}
            />
            <Controller
              name="file"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <Box>
                  <TextInput
                    size="md"
                    label="Upload file"
                    placeholder="Select a file"
                    value={
                      value?.name || (assignment?.fileUrl ? getFileName(assignment.fileUrl) : "")
                    }
                    onClick={() => document.getElementById("hidden-file-input")?.click()}
                    styles={inputStyles}
                    error={errors.file?.message}
                    readOnly
                  />
                  <FileInput
                    id="hidden-file-input"
                    style={{ display: "none" }}
                    accept={acceptedFileTypesString}
                    onChange={(file) => {
                      handleFileChange(file);
                      onChange(file);
                    }}
                    {...rest}
                  />
                  {filePreview && (
                    <Box mt="md">
                      <Text size="md" mb="xs" c="#4CAF50" fw={500}>
                        File Preview:
                      </Text>
                      {watchFile?.type.startsWith("image/") ? (
                        <Image
                          src={filePreview}
                          alt="File Preview"
                          width={360}
                          height={200}
                          style={{ width: "100%", height: "200px" }}
                        />
                      ) : (
                        <Image
                          src="/icons8-file.svg"
                          alt="File Icon"
                          width={360}
                          height={200}
                          style={{ width: "100%", height: "200px" }}
                        />
                      )}
                    </Box>
                  )}
                  {!filePreview && assignment?.fileUrl && (
                    <Box mt="md" onClick={handleDownload} style={{ cursor: "pointer" }}>
                      <Text size="md" mb="xs" c="#4CAF50" fw={500}>
                        Current File:
                      </Text>
                      {assignment.fileUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                        <Image
                          src={assignment.fileUrl}
                          alt="Current File"
                          width={360}
                          height={200}
                          style={{ width: "100%", height: "200px" }}
                        />
                      ) : (
                        <Image
                          src="/icons8-file.svg"
                          alt="File Icon"
                          width={360}
                          height={200}
                          style={{ width: "100%", height: "200px" }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              )}
            />
            <Controller
              name="dueDate"
              control={control}
              render={({ field: { onChange, value, ...rest }, fieldState: { error } }) => (
                <DateInput
                  {...rest}
                  value={value ? new Date(value) : null}
                  onChange={(val) => onChange(val)}
                  label="Due Date"
                  placeholder="Select due date"
                  error={error?.message}
                  styles={{
                    ...formStyles,
                    day: {
                      "&[data-selected]": {
                        color: "#333",
                        backgroundColor: "#f6f6f6",
                      },
                    },
                  }}
                  popoverProps={{ withinPortal: true }}
                />
              )}
            />
          </SimpleGrid>
          <Group mt="xl" mb="sm">
            <Button size="sm" color="gray" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!isValid || !isDirty}
              style={{
                backgroundColor: isValid && isDirty ? "#4caf50" : "#f5f5f5",
                color: isValid && isDirty ? "white" : "#9e9e9e",
                cursor: !isValid || !isDirty ? "not-allowed" : "pointer",
              }}
              loading={isLoading}
            >
              {isUpdateAssignment ? "Update" : "Create"}
            </Button>
          </Group>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateAssignmentFormModal;
