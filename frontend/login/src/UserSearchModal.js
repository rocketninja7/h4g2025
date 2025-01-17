import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const ModalOverlay = ({ onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const UserSearchModal = ({ users, onClose, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ padding: "24px", borderBottom: "1px solid #eee" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "600",
              color: "#1a1a1a",
            }}
          >
            Start New Chat
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              marginRight: "-8px",
            }}
          >
            <X size={24} color="#666" />
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
            }}
            size={20}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "80%",
              padding: "12px 16px 12px 48px",
              border: "1px solid #4f46e5",
              borderRadius: "8px",
              fontSize: "16px",
              backgroundColor: "#f8f8f8",
            }}
            autoFocus
          />
        </div>
      </div>

      <div
        style={{
          overflowY: "auto",
          maxHeight: "calc(90vh - 140px)",
          padding: "16px",
        }}
      >
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            style={{
              width: "100%",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              border: "none",
              background: "white",
              cursor: "pointer",
              borderRadius: "8px",
              transition: "background-color 0.2s",
              textAlign: "left",
              marginBottom: "8px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f5f5f5")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1976d2",
                fontWeight: "500",
                fontSize: "18px",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "500",
                  fontSize: "16px",
                  marginBottom: "4px",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                Online
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "32px 16px",
              color: "#666",
            }}
          >
            No users found matching "{searchQuery}"
          </div>
        )}
      </div>
    </ModalOverlay>
  );
};

export default UserSearchModal;
