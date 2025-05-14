import React, { useState } from "react";
import { Button, Modal, List, Space, Spin, Alert, Input } from "antd";
import CKEditor1 from './CKEditor1.jsx' 
import '@ant-design/v5-patch-for-react-19';

const ManagePostsButton = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Modal for viewing posts
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal for editing posts
  const [posts, setPosts] = useState([]); // State for posts
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error state
  const [editingPost, setEditingPost] = useState(null); // Post being edited
  const [title, setTitle] = useState(""); // Title for editing post
  const [content, setContent] = useState(""); // Content for editing post

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/posts");
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewModalOpen = () => {
    setIsViewModalOpen(true);
    fetchPosts(); // Fetch posts when viewing modal opens
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
  };

  const handleEditModalOpen = (post) => {
    setEditingPost(post); // Set the post to be edited
    setTitle(post.title); // Populate the title field
    setContent(post.content); // Populate the content field
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const updatePost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${editingPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to update post");
      }
      setEditingPost(null);
      setTitle(""); // Reset title
      setContent(""); // Reset content
      setIsEditModalOpen(false); // Close modal
      fetchPosts(); // Refresh posts list
    } catch (err) {
      alert(`Error updating post: ${err.message}`);
    }
  };

  // Function to delete a post
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }
      // Remove the deleted post from the local state
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      alert(`Cannot delete post: ${err.message}`);
    }
  };

  return (
    <>
      {/* Button to view posts */}
      <Button onClick={handleViewModalOpen}>Edit Posts</Button>

      {/* Modal for viewing posts */}
      <Modal
        title="Danh sách bài viết"
        open={isViewModalOpen}
        onCancel={handleViewModalClose}
        footer={null}
        width="80%"
      >
        {loading ? (
          <Spin tip="Đang tải bài viết..." />
        ) : error ? (
          <Alert message="Lỗi" description={error} type="error" showIcon />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={posts}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="primary" onClick={() => handleEditModalOpen(item)}>
                    Edit
                  </Button>,
                  <Button type="danger" onClick={() => deletePost(item.id)}>
                    Delete
                  </Button>,
                ]}
              >
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* Modal for editing a post */}
      <Modal
        title="Edit Post"
        open={isEditModalOpen}
        onOk={updatePost}
        onCancel={handleEditModalClose}
        okText="Save Changes"
        cancelText="Cancel"
        width="80%"
      >
        <Input
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <CKEditor1
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data); // Update content dynamically
          }}
          data={content} // Initialize CKEditor content
        />
      </Modal>
    </>
  );
};

export default ManagePostsButton;
