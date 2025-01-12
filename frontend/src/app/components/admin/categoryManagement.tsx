"use client";
import React, { useEffect, useState } from "react";
import "../../styles/categoryManagement.css";

interface Category {
  name: string;
  access: string[];
}

const AdminCategorySessionManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [newCategoryValue, setNewCategoryValue] = useState<string>("");
  const [newSessionValue, setNewSessionValue] = useState<string>("");
  const [accessControl, setAccessControl] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Fetch categories and sessions from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories-sessions");
        const data = await response.json();
        setCategories(data.categories || []);
        setSessions(data.sessions || []);
      } catch (error) {
        console.error("Error fetching categories and sessions:", error);
      }
    };

    fetchData();
  }, []);

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategoryValue) return;

    try {
      await fetch("http://localhost:5000/api/categories-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryValue, access: accessControl }),
      });

      setCategories((prevCategories) => [
        ...prevCategories,
        { name: newCategoryValue, access: accessControl },
      ]);

      setNewCategoryValue("");
      setAccessControl([]);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Handle adding a new session
  const handleAddSession = async () => {
    if (!newSessionValue) return;

    try {
      await fetch("http://localhost:5000/api/categories-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: newSessionValue }),
      });

      setSessions((prevSessions) => [...prevSessions, newSessionValue]);
      setNewSessionValue("");
    } catch (error) {
      console.error("Error adding session:", error);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (categoryName: string) => {
    try {
      await fetch("http://localhost:5000/api/categories-sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.name !== categoryName)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Handle deleting a session
  const handleDeleteSession = async (session: string) => {
    try {
      await fetch("http://localhost:5000/api/categories-sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session }),
      });

      setSessions((prevSessions) => prevSessions.filter((sess) => sess !== session));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  // Handle editing a category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryValue(category.name);
    setAccessControl(category.access);
  };

  // Handle saving an updated category
  const handleSaveCategory = async () => {
    if (!editingCategory) return;

    try {
      await fetch("http://localhost:5000/api/categories-sessions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldName: editingCategory.name,
          newName: newCategoryValue,
          access: accessControl,
        }),
      });

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.name === editingCategory.name
            ? { name: newCategoryValue, access: accessControl }
            : cat
        )
      );

      setEditingCategory(null);
      setNewCategoryValue("");
      setAccessControl([]);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // Handle access control changes
  const handleAccessChange = (userType: string) => {
    setAccessControl((prevAccess) =>
      prevAccess.includes(userType)
        ? prevAccess.filter((access) => access !== userType)
        : [...prevAccess, userType]
    );
  };

  return (
    <div className="admin-category-session-container">
      <h1>Admin: Manage Categories and Sessions</h1>

      <div className="section">
        <h2>Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.name}>
              {editingCategory?.name === category.name ? (
                <>
                  <input
                    type="text"
                    value={newCategoryValue}
                    onChange={(e) => setNewCategoryValue(e.target.value)}
                  />
                  <div className="access-control">
                    <label>
                      <input
                        type="checkbox"
                        checked={accessControl.includes("Pelajar FSKSM")}
                        onChange={() => handleAccessChange("Pelajar FSKSM")}
                      />
                      Pelajar FSKSM
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={accessControl.includes("Pensyarah")}
                        onChange={() => handleAccessChange("Pensyarah")}
                      />
                      Pensyarah
                    </label>
                  </div>
                  <button onClick={handleSaveCategory}>Save</button>
                  <button onClick={() => setEditingCategory(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {category.name}
                  <span>Accessible by: {category.access.join(", ")}</span>
                  <div className="action-buttons">
                    <button onClick={() => handleEditCategory(category)}>Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCategory(category.name)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add new category"
          value={newCategoryValue}
          onChange={(e) => setNewCategoryValue(e.target.value)}
        />
        <div className="access-control">
          <label>
            <input
              type="checkbox"
              checked={accessControl.includes("Pelajar FSKSM")}
              onChange={() => handleAccessChange("Pelajar FSKSM")}
            />
            Pelajar FSKSM
          </label>
          <label>
            <input
              type="checkbox"
              checked={accessControl.includes("Pensyarah")}
              onChange={() => handleAccessChange("Pensyarah")}
            />
            Pensyarah
          </label>
        </div>
        <button className="add-btn" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <div className="section">
        <h2>Sessions</h2>
        <ul>
          {sessions.map((session) => (
            <li key={session}>
              {session}
              <div className="action-buttons">
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteSession(session)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add new session"
          value={newSessionValue}
          onChange={(e) => setNewSessionValue(e.target.value)}
        />
        <button className="add-btn" onClick={handleAddSession}>
          Add Session
        </button>
      </div>
    </div>
  );
};

export default AdminCategorySessionManagement;
