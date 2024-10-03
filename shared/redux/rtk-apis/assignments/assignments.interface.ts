export interface CreateAssignmentDto {
  file: File;
  title: string;
  description: string;
  dueDate: Date;
}

export interface AssignmentsResponseDto {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  classroomId?: number;
  dueDate: Date;
}

export interface StudentResponseDto {
  submissionId: number;
  firstName: string;
  lastName: string;
  fileUrl: string;
  createdAt: Date;
}

export interface IApiSubmissionResponse {
  id: number;
  createdAt: Date;
  fileUrl: string;
  student: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}
