import React, { useState, useEffect } from "react";

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
import { showNotification } from "@mantine/notifications";
import { useForm, Controller } from "react-hook-form";

import { ApiError } from "@/modules/Login/containers/LoginContainer.types";
import {
  useUploadResourceMutation,
  useUpdateResourceMutation,
  useGetResourceDownloadUrlQuery,
} from "@/shared/redux/rtk-apis/classworks/classworks.api";
import { getFileName } from "@/shared/utils/getFileName";

import {
  materialFormSchema,
  TMaterialFormValues,
  editMaterialFormSchema,
  acceptedFileTypesString,
} from "./MaterialFormModal.helpers";
import { IMaterialFormModalProps } from "./MaterialFormModal.interface";
import { inputStyles } from "./MaterialFormModal.styles";

const MaterialFormModal: React.FC<IMaterialFormModalProps> = ({
  opened,
  onClose,
  classroomId,
  resource,
}) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<TMaterialFormValues>({
    resolver: zodResolver(resource ? editMaterialFormSchema : materialFormSchema),
    mode: "onBlur",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadResource] = useUploadResourceMutation();
  const [updateResource] = useUpdateResourceMutation();

  const { data: downloadUrl } = useGetResourceDownloadUrlQuery(
    {
      classroomId,
      resourceId: resource?.id || 0,
    },
    {
      skip: !resource,
    },
  );

  useEffect(() => {
    if (opened) {
      if (resource) {
        reset({
          title: resource.title,
          description: resource.description,
        });
      } else {
        reset({
          title: "",
          description: "",
        });
      }
      setFilePreview(null);
    }
  }, [opened, resource, reset]);

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    } else {
      console.error("Download URL is undefined");
    }
  };

  const onSubmit = async (data: TMaterialFormValues) => {
    setIsLoading(true);
    try {
      if (resource) {
        await updateResource({
          classroomId,
          resourceId: resource.id,
          data: {
            classroomId: classroomId,
            file: data.file,
            title: data.title,
            description: data.description,
          },
        }).unwrap();

        showNotification({
          title: "Success",
          message: "Resource updated successfully!",
          color: "blue",
        });
      } else {
        await uploadResource({
          file: data.file,
          classroomId,
          title: data.title,
          description: data.description,
        }).unwrap();

        showNotification({
          title: "Success",
          message: "Resource uploaded successfully!",
          color: "blue",
        });
      }

      onClose();
    } catch (error) {
      showNotification({
        title: resource ? "Update failed" : "Upload failed",
        message: (error as ApiError).data?.message,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFilePreview(fileUrl);
    } else {
      setFilePreview(null);
    }
  };

  return (
    <Modal opened={opened} onClose={handleCancel} size="md" centered>
      <Box mx="xl">
        <Text mb={20} fw={700} tt="uppercase" size="lg" c="#4CAF50">
          {resource ? "Edit Material" : "Upload Material"}
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
                    value={value?.name || (resource?.fileUrl ? getFileName(resource.fileUrl) : "")}
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
                      {value?.type.startsWith("image/") ? (
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
                          alt="PDF Icon"
                          width={360}
                          height={200}
                          style={{ width: "100%", height: "200px" }}
                        />
                      )}
                    </Box>
                  )}
                  {!value && resource?.fileUrl && (
                    <Box mt="md" onClick={handleDownload} style={{ cursor: "pointer" }}>
                      <Text size="md" mb="xs" c="#4CAF50" fw={500}>
                        Current File:
                      </Text>
                      {resource?.fileUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                        <Image
                          src={resource.fileUrl}
                          alt="Current File"
                          width={360}
                          height={200}
                          style={{ width: "100%", height: "200px" }}
                        />
                      ) : (
                        <Image
                          src="/icons8-file.svg"
                          alt="PDF Icon"
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
              {resource ? "Update" : "Create"}
            </Button>
          </Group>
        </form>
      </Box>
    </Modal>
  );
};

export default MaterialFormModal;
