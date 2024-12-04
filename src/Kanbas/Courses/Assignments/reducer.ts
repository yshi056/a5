import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface AssignmentsState {
  assignments: Assignment[];
}

const initialState: AssignmentsState = {
  assignments: [],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignment: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments.push(action.payload);
    },
    editAssignment: (state, action: PayloadAction<string>) => {
      const assignment = state.assignments.find(
        (assignment) => assignment._id === action.payload
      );
      if (assignment) {
        assignment.editing = true;
      }
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      const index = state.assignments.findIndex(
        (assignment) => assignment._id === action.payload._id
      );
      if (index >= 0) {
        state.assignments[index] = action.payload;
      }
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(
        (assignment) => assignment._id !== action.payload
      );
    },
  },
});

export const {
  setAssignment,
  addAssignment,
  editAssignment,
  updateAssignment,
  deleteAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;