// src/components/common/DropdownMenu.tsx
import { useEffect, useRef, useState } from "react";

interface DropdownMenuProps {
  trigger: React.ReactNode; // The element that triggers the dropdown (e.g., profile icon)
  children: React.ReactNode; // The content of the dropdown
  position?: "left" | "right"; // Position of the dropdown relative to the trigger
}

const DropdownMenu = ({
  trigger,
  children,
  position = "right",
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle the dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Element */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={`absolute ${
            position === "right" ? "right-0" : "left-0"
          } mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50`}
        >
          <ul className="py-2">{children}</ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
