import { projectApi } from "../api.config";
import { IApiSubmissionResponse, StudentResponseDto } from "../assignments/assignments.interface";

const submissionApi = projectApi.injectEndpoints({
  endpoints: (builder) => ({
    submitAssignment: builder.mutation<
      void,
      { assignmentId: number; classroomId: number; userId: number; file: File }
    >({
      query: ({ classroomId, assignmentId, userId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("assignmentId", assignmentId.toString());
        formData.append("userId", userId.toString());
        return {
          url: `/classrooms/${classroomId}/assignments/${assignmentId}/submit-assignment`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_, __, { classroomId }) => [{ type: "Assignments", id: classroomId }],
    }),

    getAssignmentSubmissions: builder.query<
      StudentResponseDto[],
      { assignmentId: number; classroomId: number }
    >({
      query: ({ assignmentId, classroomId }) => ({
        url: `/classrooms/${classroomId}/assignments/${assignmentId}/submissions`,
        method: "GET",
      }),
      providesTags: (_, __, { classroomId }) => [{ type: "Assignments", id: classroomId }],
      transformResponse: (response: IApiSubmissionResponse[]): StudentResponseDto[] =>
        response.map((submission) => ({
          submissionId: submission.id,
          firstName: submission.student.user.firstName.trim(),
          lastName: submission.student.user.lastName.trim(),
          fileUrl: submission.fileUrl,
          createdAt: submission.createdAt,
        })),
    }),

    getSubmissionStatus: builder.query<
      { submitted: boolean; submissionId?: number },
      { assignmentId: number; userId: number; classroomId: number }
    >({
      query: ({ assignmentId, userId, classroomId }) => ({
        url: `/classrooms/${classroomId}/assignments/${assignmentId}/user/${userId}/submission-status`,
        method: "GET",
      }),
      providesTags: (_, __, { classroomId }) => [{ type: "Assignments", id: classroomId }],
    }),

    deleteSubmission: builder.mutation<
      { message: string },
      { classroomId: number; submissionId: number }
    >({
      query: ({ classroomId, submissionId }) => ({
        url: `/classrooms/${classroomId}/submissions/${submissionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { classroomId }) => [{ type: "Assignments", id: classroomId }],
    }),

    getSubmissionDownloadUrl: builder.query<string, { classroomId: number; submissionId: number }>({
      query: ({ classroomId, submissionId }) => ({
        url: `/classrooms/${classroomId}/submissions/${submissionId}/download`,
        responseHandler: (response) => response.text(),
      }),
      providesTags: (_, __, { classroomId }) => [{ type: "Assignments", id: classroomId }],
      transformResponse: (responseData: string) => responseData,
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubmitAssignmentMutation,
  useGetAssignmentSubmissionsQuery,
  useGetSubmissionStatusQuery,
  useDeleteSubmissionMutation,
  useGetSubmissionDownloadUrlQuery,
} = submissionApi;
