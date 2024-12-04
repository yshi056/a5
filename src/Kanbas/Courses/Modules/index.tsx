import React, { useState, useEffect} from "react";
import { useParams } from "react-router";
import { BsGripVertical } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import * as coursesClient from "../client";
import * as modulesClient from "./client";

import {
  setModule,
  addModule,
  editModule,
  updateModule,
  deleteModule,
} from "./reducer";

type Module = {
  _id: string;
  name: string;
  course: string;
  lessons: any[];
  editing?: boolean;
};

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();
  const fetchModules = async () => {
    const modules = await coursesClient.findModulesForCourse(cid as string);
    dispatch(setModule(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);
  const createModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const module = await coursesClient.createModuleForCourse(cid, newModule);
    dispatch(addModule(module));
  };
  const removeModule = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };
  const saveModule = async (module: any) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };

  return (
    <div className="wd-modules">
      <ModulesControls setModuleName={setModuleName} moduleName={moduleName} addModule={createModuleForCourse} />
      <ul id="wd-modules" className="list-group rounded-0">
        {modules
          .map((module: Module) => (
            <li
              key={module._id}
              className="d-flex align-items-center p-3 bg-secondary"
            >
              <BsGripVertical className="me-2 fs-3" />
              <div className="flex-grow-1">
                {!module.editing && module.name}
                {module.editing && (
                  <input
                    className="form-control w-50 d-inline-block"
                    onChange={(e) =>
                      dispatch(
                        updateModule({ ...module, name: e.target.value })
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveModule({ ...module, editing: false });
                      }
                    }}
                    defaultValue={module.name}
                  />
                )}
              </div>
              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={(moduleId) => removeModule(moduleId)}
                editModule={() => dispatch(editModule(module._id))}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}


