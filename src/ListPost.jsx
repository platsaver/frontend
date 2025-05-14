import React, { useState, useEffect } from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space, Spin, Alert, Typography } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';

const { Title } = Typography;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/posts');
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const posts = await response.json();

      const formattedData = posts.map((post, i) => ({
        href: post.slug ? `/posts/${post.slug}` : 'https://ant.design',
        title: post.title || `Post ${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
        description:
          post.content?.slice(0, 100) + (post.content?.length > 100 ? '...' : '') ||
          'No description available',
        content: post.content || 'No content available',
      }));

      setData(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Set up SSE connection
  useEffect(() => {
    fetchPosts(); // Initial fetch

    const eventSource = new EventSource('http://localhost:3000/api/events');

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      console.log('SSE Event:', eventData);

      switch (eventData.event) {
        case 'post_added':
          setData((prevData) => [
            {
              href: eventData.data.slug ? `/posts/${eventData.data.slug}` : 'https://ant.design',
              title: eventData.data.title,
              avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${prevData.length}`,
              description:
                eventData.data.content?.slice(0, 100) +
                (eventData.data.content?.length > 100 ? '...' : '') ||
                'No description available',
              content: eventData.data.content || 'No content available',
            },
            ...prevData,
          ]);
          break;

        case 'post_updated':
          setData((prevData) =>
            prevData.map((item) =>
              item.href === `/posts/${eventData.data.slug}`
                ? {
                    href: `/posts/${eventData.data.slug}`,
                    title: eventData.data.title,
                    avatar: item.avatar, // Keep existing avatar
                    description:
                      eventData.data.content?.slice(0, 100) +
                      (eventData.data.content?.length > 100 ? '...' : '') ||
                      'No description available',
                    content: eventData.data.content || 'No content available',
                  }
                : item
            )
          );
          break;

        case 'post_deleted':
          setData((prevData) =>
            prevData.filter((item) => item.href !== `/posts/${eventData.data.id}`)
          );
          break;

        default:
          break;
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      setError('Failed to connect to real-time updates');
      eventSource.close();
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  const renderHTML = (htmlContent) => {
    return { __html: htmlContent };
  };

  if (loading) {
    return <Spin tip="Loading posts..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 3,
      }}
      dataSource={data}
      footer={
        <div>
          <b>ant design</b> footer part
        </div>
      }
      renderItem={(item) => (
        <List.Item
          key={item.title}
          actions={[
            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
          ]}
          extra={
            <img
              width={272}
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          }
        >
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={<a href={item.href}>{item.title}</a>}
            description={item.description}
          />
          <div
            className="post-content"
            dangerouslySetInnerHTML={renderHTML(item.content)}
          />
        </List.Item>
      )}
    />
  );
};

export default App;