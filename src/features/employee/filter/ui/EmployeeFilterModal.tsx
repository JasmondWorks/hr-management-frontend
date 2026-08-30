import React, { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import { Search } from "@/shared/ui/icons";

interface EmployeeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTMENTS = [
  "Design", "HR", "Sales", "Business Analyst", "Project Manager",
  "Java", "Python", "React JS", "Account", "Nods JS"
];

export function EmployeeFilterModal({ isOpen, onClose }: EmployeeFilterModalProps) {
  const [selectedDeps, setSelectedDeps] = useState<Set<string>>(new Set(["Design", "Java", "Python", "Project Manager"]));
  const [selectedType, setSelectedType] = useState<string>("Office");

  const toggleDept = (dept: string) => {
    const newDeps = new Set(selectedDeps);
    if (newDeps.has(dept)) {
      newDeps.delete(dept);
    } else {
      newDeps.add(dept);
    }
    setSelectedDeps(newDeps);
  };

  return (
    <Modal title="Filter" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6 pt-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Employee"
            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Departments */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Department</h4>
          <div className="grid grid-cols-2 gap-y-3">
            {DEPARTMENTS.map(dept => (
              <label key={dept} className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                  selectedDeps.has(dept) 
                    ? 'bg-primary border-primary' 
                    : 'bg-background border-border group-hover:border-primary'
                }`}>
                  {selectedDeps.has(dept) && (
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{dept}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Select Type */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Select Type</h4>
          <div className="flex items-center gap-6">
            {["Office", "Work from Home"].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                  selectedType === type 
                    ? 'border-primary' 
                    : 'border-border group-hover:border-primary'
                }`}>
                  {selectedType === type && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-border hover:bg-muted text-foreground transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors text-sm font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
}
