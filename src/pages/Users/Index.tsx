import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  Table,
  Switch,
  message,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  getUserList,
  updateUserStatus,
  deleteUser,
  createUser,
  updateUser,
} from "@/api/user";
import type { User, CreateUserParams, UpdateUserParams } from "@/api/user";
import Pagination from "@/components/Pagination";
import "./users.scss";

interface UserRecord extends User {
  createdAt: string; // ISO 字符串
}

export default function Users() {
  const [form] = Form.useForm();
  const [userForm] = Form.useForm(); // 用户表单（新增/编辑）
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

  // 新增/编辑弹窗状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("新增用户");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // 加载用户列表数据
  const loadUserList = async (
    customParams?: { name?: string; phone?: string },
    customPage?: number
  ) => {
    setLoading(true);
    try {
      // 使用传入的参数，如果没有则使用 state 中的值
      const params = customParams !== undefined ? customParams : searchParams;
      const page = customPage !== undefined ? customPage : pagination.current;
      const res = await getUserList({
        page: page,
        pageSize: pagination.pageSize,
        ...params,
      });
      setDataSource(res.list || []);
      setPagination({
        current: page,
        pageSize: pagination.pageSize,
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

  // 处理分页改变
  const handlePaginationChange = (page: number, size: number) => {
    setPagination({
      current: page,
      pageSize: size,
      total: pagination.total,
    });
  };

  // 处理每页条数改变
  const handlePageSizeChange = (current: number, size: number) => {
    setPagination({
      current: current,
      pageSize: size,
      total: pagination.total,
    });
  };

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const newSearchParams = {
      name: values.name?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
    };
    // 更新 state（用于其他地方可能需要用到）
    setSearchParams(newSearchParams);
    // 直接使用新的搜索参数和第一页加载数据，不依赖 state 更新
    loadUserList(newSearchParams, 1);
  };

  // 处理新增用户
  const handleAdd = () => {
    setModalTitle("新增用户");
    setEditingUserId(null);
    userForm.resetFields();
    userForm.setFieldsValue({ status: 1 }); // 默认启用
    setModalVisible(true);
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
    setModalTitle("编辑用户");
    setEditingUserId(record.id);
    userForm.setFieldsValue({
      name: record.name,
      phone: record.phone,
      status: record.status,
      password: "", // 编辑时密码为空，不填写则不更新
    });
    setModalVisible(true);
  };

  // 处理表单提交（新增/编辑）
  const handleUserFormSubmit = async () => {
    try {
      const values = await userForm.validateFields();
      
      if (editingUserId) {
        // 编辑用户
        const updateParams: UpdateUserParams = {
          name: values.name,
          phone: values.phone,
          status: values.status,
        };
        // 只有填写了密码才更新
        if (values.password && values.password.trim()) {
          updateParams.password = values.password;
        }
        await updateUser(editingUserId, updateParams);
        message.success("用户更新成功");
      } else {
        // 新增用户
        const createParams: CreateUserParams = {
          name: values.name,
          phone: values.phone,
          password: values.password,
          status: values.status ?? 1,
        };
        await createUser(createParams);
        message.success("用户创建成功");
      }
      
      setModalVisible(false);
      userForm.resetFields();
      await loadUserList();
    } catch (error: any) {
      if (error?.errorFields) {
        // 表单验证错误
        return;
      }
      console.error("操作失败:", error);
      message.error(error?.message || "操作失败");
    }
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
              onClick={handleAdd}
              icon={<PlusOutlined />}
              style={{ marginLeft: 12 }}
              className="reset-btn"
            >
              新增
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
          pagination={false}
        />
      </div>

      {/* 自定义分页组件 */}
      <div className="users-pagination">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          pageSizeOptions={["10", "15", "20", "50", "100"]}
          onChange={handlePaginationChange}
          onPageSizeChange={handlePageSizeChange}
          showQuickJumper={true}
          showTotal={true}
        />
      </div>

      {/* 新增/编辑用户弹窗 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleUserFormSubmit}
        onCancel={() => {
          setModalVisible(false);
          userForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        width={500}
      >
        <Form
          form={userForm}
          layout="vertical"
          initialValues={{ status: 1 }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: "请输入姓名" },
              { max: 50, message: "姓名不能超过50个字符" },
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: "请输入手机号" },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: !editingUserId,
                message: "请输入密码",
              },
              {
                min: 6,
                message: "密码至少6位",
              },
              {
                max: 20,
                message: "密码不能超过20位",
              },
            ]}
            extra={editingUserId ? "留空则不修改密码" : ""}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: "请选择状态" }]}
            valuePropName="checked"
            getValueFromEvent={(checked) => (checked ? 1 : 0)}
            getValueProps={(value) => ({ checked: value === 1 })}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
