import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

export const createAssignment = async (courseId: string, assignment: any) => {
  const COURSES_API = `${REMOTE_SERVER}/api/courses`;
  const response = await axios.post(`${COURSES_API}/${courseId}/assignments`, assignment);
  return response.data;
};

export const updateAssignment = async (assignment: any) => {
  const response = await axios.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
  return response.data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const COURSES_API = `${REMOTE_SERVER}/api/courses`;
  const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};

export const fetchAllAssignments = async () => {
    const response = await axios.get(`${ASSIGNMENTS_API}`);
    return response.data;
};

export const findAssignmentById = async (assignmentId: string) => {
    const response = await axios.get(`${ASSIGNMENTS_API}/${assignmentId}`);
    return response.data;
};