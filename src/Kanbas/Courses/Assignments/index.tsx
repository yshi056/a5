import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsGripVertical } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import AssignmentControlButtons from "./AssignmentControlButtons";
import AssignmentControls from "./AssignmentControls";
import * as assignmentsClient from "./client";
import {
  setAssignment,
  addAssignment,
  editAssignment,
  updateAssignment,
  deleteAssignment,
} from "./reducer";
import { RootState } from "../../store";

type Assignment = {
  _id: string;
  title: string;
  cid: string;
  description: string;
  points: string;
  availableFrom: string;
  availableUntil: string;
  editing?: boolean;
};

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const assignments = useSelector(
    (state: RootState) => state.assignmentReducer?.assignments || []
  );
  const dispatch = useDispatch();

  const fetchAssignments = async () => {
    if (!cid) return;
    const fetchedAssignments = await assignmentsClient.findAssignmentsForCourse(cid);
    dispatch(setAssignment(fetchedAssignments));
  };

  useEffect(() => {
    fetchAssignments();
  }, [cid]);

  const createAssignmentForCourse = async () => {
    if (!cid) {
      console.error("Course ID (cid) is undefined. Cannot create assignment.");
      return;
    }
  
    if (assignmentTitle.trim() === "") {
      console.error("Assignment title is empty. Please provide a title.");
      return;
    }
  
    const newAssignment: Assignment = {
      _id: Date.now().toString(), // Generates a unique ID based on timestamp
      title: assignmentTitle.trim(), // Ensure no trailing or leading spaces
      cid, // Use the course ID from the parameters
      description: "New Assignment", // Default description
      points: "0", // Default points
      availableFrom: "", // Default availability
      availableUntil: "", // Default until
    };
  
    try {
      // Make an API call to create the assignment
      const createdAssignment = await assignmentsClient.createAssignment(cid, newAssignment);
  
      // Dispatch to add the created assignment to the state
      dispatch(addAssignment(createdAssignment));
  
      // Clear the input field
      setAssignmentTitle("");
    } catch (error) {
      console.error("Failed to create assignment:", error);
      alert("There was an error creating the assignment. Please try again.");
    }
  };
  

  const removeAssignment = async (assignmentId: string) => {
    try {
      await assignmentsClient.deleteAssignment(assignmentId);
      dispatch(deleteAssignment(assignmentId));
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  const saveAssignment = async (assignment: Assignment) => {
    try {
      const updatedAssignment = await assignmentsClient.updateAssignment(assignment);
      dispatch(updateAssignment(updatedAssignment));
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.cid === cid &&
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToEditor = (assignmentId: string) => {
    navigate(`/Kanbas/Courses/${cid}/Assignments/${assignmentId}`);
  };

  return (
    <div className="wd-assignments">
      <AssignmentControls
        assignmentTitle={assignmentTitle}
        setAssignmentTitle={setAssignmentTitle}
        addAssignment={createAssignmentForCourse}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ul id="wd-assignments" className="list-group rounded-0">
        {filteredAssignments.map((assignment: Assignment) => (
          <li
            key={assignment._id}
            className="d-flex align-items-center p-3 bg-secondary"
          >
            <BsGripVertical className="me-2 fs-3" />
            <div
              className="flex-grow-1"
              onClick={() => navigateToEditor(assignment._id)} // Navigate to the editor
              style={{ cursor: "pointer" }}
            >
              {!assignment.editing && <span>{assignment.title}</span>}
              {assignment.editing && (
                <input
                  className="form-control w-50 d-inline-block"
                  value={assignment.title}
                  onChange={(e) =>
                    dispatch(
                      updateAssignment({
                        ...assignment,
                        title: e.target.value,
                      })
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveAssignment({ ...assignment, editing: false });
                    }
                  }}
                />
              )}
            </div>
            <AssignmentControlButtons
              editAssignment={() => dispatch(editAssignment(assignment._id))}
              deleteAssignment={() => removeAssignment(assignment._id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}