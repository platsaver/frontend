import React, { useState, useEffect } from "react";
import { Button, Modal, List, Space, Spin, Alert } from "antd";
import '@ant-design/v5-patch-for-react-19';

const DeletePostsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch posts when modal opens
  const fetchPosts = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch("http://localhost:3000/api/posts"); // Replace with your API URL
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json(); // Parse response
      setPosts(data); // Save posts to state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    fetchPosts(); // Fetch posts when modal opens
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }
      // Remove post from local state after deletion
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err.message);
      alert("Không thể xóa bài viết");
    }
  };

  return (
    <>
      <Button onClick={showModal}>Delete Post</Button>

      <Modal
        title="Danh sách bài viết"
        open={isModalOpen}
        onCancel={handleCancel}
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
                  <Button
                    type="danger"
                    onClick={() => deletePost(item.id)}
                  >
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </>
  );
};

export default DeletePostsButton;
