import React, { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Text, ActionIcon, Box, Image } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Form, FormSubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "react-hook-form-mantine";
import { FaPaperclip, FaTimes } from "react-icons/fa";

import { useCreateMessageMutation } from "@/shared/redux/rtk-apis/messages/messages.api";

import { acceptedFileTypesString } from "../CreateAssignmentFormModal/CreateAssignmentFormModal.helpers";
import { SendMessageFormSchema, SendMessageFormValues } from "./SendMessageForm.helpers";
import { ISendMessageFormProps, ISendMessageFormValues } from "./SendMessageForm.interface";

const SendMessageForm: React.FC<ISendMessageFormProps> = ({ classroomId }) => {
  const {
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ISendMessageFormValues>({
    defaultValues: {
      content: "",
      file: undefined,
    },
    resolver: zodResolver(SendMessageFormSchema),
  });

  const [createMessage] = useCreateMessageMutation();
  const watchFile = watch("file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit: FormSubmitHandler<SendMessageFormValues> = async (formPayload) => {
    try {
      const formData = new FormData();
      formData.append("content", formPayload.data.content);
      formData.append("classroomId", classroomId.toString());
      if (formPayload.data.file) {
        formData.append("file", formPayload.data.file);
      }

      await createMessage(formData).unwrap();

      notifications.show({
        color: "blue",
        title: "Success",
        message: "Message sent!",
      });
      reset();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to send message",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("file", file);
    }
  };

  const removeFile = () => {
    setValue("file", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form control={control} onSubmit={onSubmit}>
      <Box sx={{ position: "relative" }}>
        <Textarea
          placeholder="Type your message here"
          size="lg"
          control={control}
          name="content"
          error={errors.content?.message}
          rightSection={
            <ActionIcon onClick={() => fileInputRef.current?.click()}>
              <FaPaperclip size={18} />
            </ActionIcon>
          }
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept={acceptedFileTypesString}
        />
      </Box>

      {watchFile && (
        <Box
          mt="xs"
          p="xs"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
            borderRadius: theme.radius.sm,
          })}
        >
          <Group position="apart" align="center">
            <Text size="sm" c={"#4CAF50"}>
              {watchFile.name}
            </Text>
            <ActionIcon onClick={removeFile}>
              <FaTimes size={14} />
            </ActionIcon>
          </Group>
          {watchFile.type.startsWith("image/") && (
            <Image
              src={URL.createObjectURL(watchFile)}
              alt="Preview"
              mt="xs"
              sx={{ maxWidth: "200px", Height: "200px" }}
            />
          )}
        </Box>
      )}

      <Group mt="md" position="right">
        <Button size="sm" color="blue" onClick={() => reset()}>
          Reset
        </Button>
        <Button size="sm" color="blue" type="submit">
          Post
        </Button>
      </Group>
    </Form>
  );
};

export default SendMessageForm;
