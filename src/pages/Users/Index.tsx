import { useEffect, useState } from "react";
import { Avatar, Button, Form, Input, Table, Switch, message, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getUserList, updateUserStatus, deleteUser } from "@/api/user";
import type { User } from "@/api/user";
import "./users.scss";

interface UserRecord extends User {
  createdAt: string; // ISO 字符串
}

export default function Users() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<UserRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 搜索条件
  const [searchParams, setSearchParams] = useState<{
    name?: string;
    phone?: string;
  }>({});

  // 加载用户列表数据
  const loadUserList = async () => {
    setLoading(true);
    try {
      const res = await getUserList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      });
      setDataSource(res.list || []);
      setPagination({
        ...pagination,
        total: res.total || 0,
      });
    } catch (error) {
      console.error("加载用户列表失败:", error);
      message.error("加载用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserList();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setSearchParams({
      name: values.name?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
    });
    setPagination({ ...pagination, current: 1 });
    // 重新加载数据
    setTimeout(() => {
      loadUserList();
    }, 0);
  };

  const handleReset = () => {
    form.resetFields();
    setSearchParams({});
    setPagination({ ...pagination, current: 1 });
    setTimeout(() => {
      loadUserList();
    }, 0);
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // 处理禁用/启用用户
  const handleStatusChange = async (userId: number, checked: boolean) => {
    try {
      await updateUserStatus(userId, checked ? 1 : 0);
      // 更新本地数据
      setDataSource((prev) =>
        prev.map((item) =>
          item.id === userId ? { ...item, status: checked ? 1 : 0 } : item
        )
      );
      message.success(checked ? "用户已启用" : "用户已禁用");
    } catch (error) {
      console.error("更新用户状态失败:", error);
      message.error("更新用户状态失败");
    }
  };

  // 处理编辑用户
  const handleEdit = (record: UserRecord) => {
    // TODO: 打开编辑弹窗或跳转到编辑页面
    console.log("编辑用户:", record);
    message.info("编辑功能待实现");
  };

  // 处理删除用户
  const handleDelete = (record: UserRecord) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除用户 "${record.name}" 吗？此操作不可恢复。`,
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteUser(record.id);
          // 重新加载列表
          await loadUserList();
          message.success("用户已删除");
        } catch (error) {
          console.error("删除用户失败:", error);
          message.error("删除用户失败");
        }
      },
    });
  };

  const columns: ColumnsType<UserRecord> = [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      width: 30,
      align: "center",
      render: (_: unknown, record: UserRecord) => {
        const firstChar = record.name?.[0] || "?";
        return (
          <Avatar style={{ backgroundColor: "#F76153" }} size={40}>
            {firstChar}
          </Avatar>
        );
      },
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "禁用/启用",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (value: number, record: UserRecord) => (
        <Switch
          checked={value === 1}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (a: UserRecord, b: UserRecord) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: null,
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      align: "center",
      render: (_: unknown, record: UserRecord) => (
        <div className="action-buttons">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="edit-btn"
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            className="delete-btn"
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="users-page">
      {/* 搜索区域 */}
      <div className="users-search">
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="name" style={{ marginBottom: 0 }}>
            <Input
              allowClear
              placeholder="请输入姓名"
              className="search-input"
            />
          </Form.Item>
          <Form.Item name="phone" style={{ marginBottom: 0 }}>
            <Input
              allowClear
              placeholder="请输入手机号"
              className="search-input"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginLeft: "auto" }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              className="search-btn"
            >
              查询
            </Button>
            <Button
              onClick={handleReset}
              style={{ marginLeft: 12 }}
              className="reset-btn"
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* 表格区域 */}
      <div className="users-table">
        <Table<UserRecord>
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共${total}条`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}
