import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, TextInput, Text, Group } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "react-hook-form";

import { useUploadMeetLinkMutation } from "@/shared/redux/rtk-apis/classrooms/classrooms.api";

import { meetlinkSchema, TMeetlinkFormValues } from "./UploadOrEditMeetLinkModal.helpers";
import { IUploadMeetlinkModalProps } from "./UploadOrEditMeetLinkModal.interface";
import { inputStyles } from "./UploadOrEditMeetLinkModal.styles";

const UploadMeetlinkModal: React.FC<IUploadMeetlinkModalProps> = ({
  opened,
  onClose,
  classroomId,
  initialValue = "",
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TMeetlinkFormValues>({
    resolver: zodResolver(meetlinkSchema),
    mode: "onChange",
    defaultValues: {
      meetlink: initialValue,
    },
  });

  const [uploadMeetLink] = useUploadMeetLinkMutation();

  useEffect(() => {
    if (opened) {
      reset({ meetlink: initialValue });
    }
  }, [opened, initialValue, reset]);

  const onSubmit = async (data: TMeetlinkFormValues) => {
    try {
      await uploadMeetLink({ classroomId, meetlink: data.meetlink }).unwrap();
      showNotification({
        title: "Success",
        message: initialValue ? "Meet link updated successfully" : "Meet link added successfully",
        color: "blue",
      });

      reset();
      onClose();
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to upload meet link",
        color: "red",
      });
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleCancel} centered>
      <Text mb={20} fw={700} tt="uppercase" size="lg" c="#4CAF50">
        {initialValue ? "Edit Meet Link" : "Upload Meet Link"}
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Meet Link URL"
          placeholder="Enter meet link"
          {...control.register("meetlink")}
          error={errors.meetlink?.message}
          styles={inputStyles}
          withAsterisk
        />
        <Group mt="xl" mb="sm" position="right">
          <Button size="sm" color="gray" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            style={{
              background: isValid ? "#4caf50" : "#f5f5f5",
              color: isValid ? "white" : "#9e9e9e",
            }}
            disabled={!isValid}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default UploadMeetlinkModal;
