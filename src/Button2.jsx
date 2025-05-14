import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import CKEditor1 from './CKEditor1.jsx';
import '@ant-design/v5-patch-for-react-19';

const AddPostsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [title, setTitle] = useState(""); // State for post title
  const [content, setContent] = useState(""); // State for post content

  // Handle adding a new post
  const addPost = async () => {
    // Validate that title and content are not empty
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to add post");
      }
      setTitle(""); // Reset title
      setContent(""); // Reset content
      setIsModalOpen(false); // Close modal
    } catch (err) {
      alert(`Error adding post: ${err.message}`);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Post
      </Button>

      {/* Modal for adding a post */}
      <Modal
        title="Add New Post"
        open={isModalOpen}
        onOk={addPost}
        onCancel={() => {
          setTitle("");
          setContent("");
          setIsModalOpen(false);
        }}
        okText="Save Post"
        cancelText="Cancel"
        width="80%"
      >
        {/* Input for post title */}
        <Input
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        {/* CKEditor component for post content */}
        <CKEditor1
          data={content} // Pass the content state to initialize the editor
          onChange={(newData) => setContent(newData)} // Update content state when the editor changes
        />
      </Modal>
    </>
  );
};

export default AddPostsButton;