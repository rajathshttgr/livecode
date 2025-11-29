"use client";
import DropDown from "@/components/dropdown";
import PeopleDropdown from "./PeopleDropdown";

export default function RoomHeader({
  roomId,
  language,
  setLanguage,
  theme,
  setTheme,
  activePeople,
  currentUser,
}) {
  return (
    <header className="px-4 py-4 border-b bg-white flex flex-wrap gap-4 justify-between items-center">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <span className="font-semibold tracking-wide text-gray-700">
          Room ID: <span className="text-black">{roomId}</span>
        </span>

        <div className="flex sm:items-center gap-3">
          <DropDown
            value={language}
            options={["python", "javascript", "c++"]}
            onChange={setLanguage}
          />

          <DropDown
            value={theme}
            options={["vs-light", "vs-dark", "hc-black"]}
            onChange={setTheme}
          />
        </div>
      </div>

      <PeopleDropdown activePeople={activePeople} currentUser={currentUser} />
    </header>
  );
}
