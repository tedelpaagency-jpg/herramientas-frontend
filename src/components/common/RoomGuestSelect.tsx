"use client";
import React, { useState, useEffect, useRef } from "react";

interface Room {
  id: number;
  adults: number;
  children: number;
  isActive?: boolean; // track if guest-count is open
}

const RoomGuestSelect: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([{ id: 1, adults: 1, children: 0, isActive: true }]); // first room active
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close all rooms on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRooms((prev) => prev.map((room) => ({ ...room, isActive: false })));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle room active state (only one active at a time)
  const toggleRoom = (roomId: number) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, isActive: !room.isActive }
          : { ...room, isActive: false } // turn off others
      )
    );
  };

  // Increment / Decrement guests
  const handleCount = (roomId: number, type: "adult" | "child", action: "plus" | "minus") => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const value = type === "adult" ? room.adults : room.children;
          const newValue = action === "plus" ? value + 1 : Math.max(0, value - 1);
          return { ...room, [type === "adult" ? "adults" : "children"]: newValue };
        }
        return room;
      })
    );
  };

  // Add new room (max 5)
  const addRoom = () => {
    if (rooms.length < 5) {
      setRooms((prev) => [
        ...prev,
        { id: prev.length + 1, adults: 1, children: 0, isActive: false },
      ]);
    }
  };

  // Delete room
  const deleteRoom = (roomId: number) => {
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
  };

  const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = rooms.reduce((sum, r) => sum + r.children, 0);

  return (
    <div className="single-search-box room-field" ref={dropdownRef}>
        <svg width={15} height={15} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <path d="M10.3097 15H4.6902C4.12797 14.9919 3.58952 14.7719 3.18254 14.3839C2.77556 13.9959 2.53004 13.4686 2.49507 12.9074L1.82921 2.7805C1.8258 2.70708 1.83698 2.6337 1.86209 2.56463C1.88721 2.49555 1.92578 2.43214 1.97556 2.37806C2.02684 2.32201 2.08893 2.27691 2.15809 2.24548C2.22724 2.21404 2.30205 2.19692 2.378 2.19513H12.6219C12.6972 2.19496 12.7717 2.21027 12.8407 2.24011C12.9098 2.26995 12.972 2.31368 13.0235 2.36858C13.075 2.42348 13.1146 2.48837 13.1399 2.55924C13.1652 2.6301 13.1757 2.70541 13.1707 2.7805L12.5341 12.9074C12.4988 13.4736 12.2491 14.0051 11.8359 14.3938C11.4228 14.7825 10.877 14.9993 10.3097 15ZM2.99263 3.29269L3.55605 12.8415C3.57466 13.1294 3.70232 13.3995 3.91303 13.5966C4.12374 13.7937 4.40166 13.9031 4.6902 13.9025H10.3097C10.5978 13.9013 10.8747 13.7914 11.085 13.5946C11.2954 13.3978 11.4236 13.1288 11.4439 12.8415L12.0366 3.32928L2.99263 3.29269Z" />
                            <path d="M14.0853 3.29269H0.914505C0.768959 3.29269 0.629374 3.23488 0.526457 3.13196C0.423541 3.02904 0.365723 2.88946 0.365723 2.74391C0.365723 2.59837 0.423541 2.45878 0.526457 2.35586C0.629374 2.25295 0.768959 2.19513 0.914505 2.19513H14.0853C14.2308 2.19513 14.3704 2.25295 14.4733 2.35586C14.5762 2.45878 14.6341 2.59837 14.6341 2.74391C14.6341 2.88946 14.5762 3.02904 14.4733 3.13196C14.3704 3.23488 14.2308 3.29269 14.0853 3.29269Z" />
                            <path d="M9.69514 3.29269H5.30489C5.15993 3.2908 5.02144 3.23237 4.91893 3.12986C4.81643 3.02735 4.758 2.88887 4.7561 2.74391V1.42683C4.76538 1.05133 4.91868 0.693778 5.18428 0.428179C5.44988 0.16258 5.80744 0.00927579 6.18294 0H8.81709C9.19884 0.00954664 9.56173 0.167932 9.82831 0.441348C10.0949 0.714765 10.244 1.08155 10.2439 1.46342V2.74391C10.242 2.88887 10.1836 3.02735 10.0811 3.12986C9.97858 3.23237 9.8401 3.2908 9.69514 3.29269ZM5.85367 2.19513H9.14636V1.46342C9.14636 1.37609 9.11167 1.29234 9.04992 1.23059C8.98817 1.16884 8.90442 1.13415 8.81709 1.13415H6.18294C6.09561 1.13415 6.01186 1.16884 5.95011 1.23059C5.88836 1.29234 5.85367 1.37609 5.85367 1.46342V2.19513ZM9.69514 12.0732C9.55018 12.0713 9.4117 12.0129 9.30919 11.9104C9.20668 11.8079 9.14825 11.6694 9.14636 11.5244V5.67075C9.14636 5.5252 9.20418 5.38562 9.30709 5.2827C9.41001 5.17978 9.54959 5.12196 9.69514 5.12196C9.84069 5.12196 9.98027 5.17978 10.0832 5.2827C10.1861 5.38562 10.2439 5.5252 10.2439 5.67075V11.5244C10.242 11.6694 10.1836 11.8079 10.0811 11.9104C9.97858 12.0129 9.8401 12.0713 9.69514 12.0732ZM5.30489 12.0732C5.15993 12.0713 5.02144 12.0129 4.91893 11.9104C4.81643 11.8079 4.758 11.6694 4.7561 11.5244V5.67075C4.7561 5.5252 4.81392 5.38562 4.91684 5.2827C5.01975 5.17978 5.15934 5.12196 5.30489 5.12196C5.45043 5.12196 5.59002 5.17978 5.69293 5.2827C5.79585 5.38562 5.85367 5.5252 5.85367 5.67075V11.5244C5.85177 11.6694 5.79335 11.8079 5.69084 11.9104C5.58833 12.0129 5.44984 12.0713 5.30489 12.0732ZM7.50001 12.0732C7.35506 12.0713 7.21657 12.0129 7.11406 11.9104C7.01155 11.8079 6.95313 11.6694 6.95123 11.5244V5.67075C6.95123 5.5252 7.00905 5.38562 7.11197 5.2827C7.21488 5.17978 7.35447 5.12196 7.50001 5.12196C7.64556 5.12196 7.78514 5.17978 7.88806 5.2827C7.99098 5.38562 8.04879 5.5252 8.04879 5.67075V11.5244C8.0469 11.6694 7.98847 11.8079 7.88596 11.9104C7.78346 12.0129 7.64497 12.0713 7.50001 12.0732Z" />
                          </g>
                        </svg>
      <div className="custom-select-dropdown">
        <h6>
          <span id="adult-qty">{totalAdults}</span> Adults,{" "}
          <span id="child-qty">{totalChildren}</span> Children
        </h6>
        <span>
          <strong>{rooms.length}</strong> Room{rooms.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="custom-select-wrap active">
        <div className="title-area">
          <h6>Guest &amp; Room</h6>
          <span>Start the journey with someone special.</span>
        </div>

        <ul className="room-list">
          {rooms.map((room) => (
            <li
              className={`single-room ${room.isActive ? "active-room" : ""}`}
              key={room.id}
            >
              <div
                className="room-title"
                onClick={() => toggleRoom(room.id)}
                style={{ cursor: "pointer" }}
              >
                <h6>Room-{room.id}</h6>
                <div className="room-delete-btn">
                  {rooms.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent toggle
                        deleteRoom(room.id);
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      <i className="bi bi-trash text-danger"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Guest count */}
              <ul className="guest-count" style={{ display: room.isActive ? "block" : "none" }}>
                <li className="single-item">
                  <div className="title">
                    <h6>Adult</h6>
                    <span>16 years+</span>
                  </div>
                  <div className="quantity-counter">
                    <a onClick={() => handleCount(room.id, "adult", "minus")} className="guest-quantity__minus">
                      <i className="bi bi-dash" />
                    </a>
                    <input type="text" readOnly className="quantity__input" value={room.adults} />
                    <a onClick={() => handleCount(room.id, "adult", "plus")} className="guest-quantity__plus">
                      <i className="bi bi-plus" />
                    </a>
                  </div>
                </li>

                <li className="single-item">
                  <div className="title">
                    <h6>Children</h6>
                    <span>0-16 years</span>
                  </div>
                  <div className="quantity-counter">
                    <a onClick={() => handleCount(room.id, "child", "minus")} className="guest-quantity__minus">
                      <i className="bi bi-dash" />
                    </a>
                    <input type="text" readOnly className="quantity__input" value={room.children} />
                    <a onClick={() => handleCount(room.id, "child", "plus")} className="guest-quantity__plus">
                      <i className="bi bi-plus" />
                    </a>
                  </div>
                </li>
              </ul>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="primary-btn1 two add-btn"
          onClick={addRoom}
          disabled={rooms.length >= 5}
        >
          Add Another Room
        </button>
      </div>
    </div>
  );
};

export default RoomGuestSelect;
