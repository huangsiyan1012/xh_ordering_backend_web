import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from "@/api/category";
import {
  createCategory,
  deleteCategory,
  getCategoryList,
  updateCategory,
  updateCategoryStatus,
} from "@/api/category";
import Pagination from "@/components/Pagination";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Switch,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import "./productCategory.scss";

export default function ProductCategory() {
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm(); // 分类表单（新增/编辑）
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 搜索条件
  const [searchParams, setSearchParams] = useState<{
    name?: string;
  }>({});

  // 新增/编辑弹窗状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("新增分类");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  // 加载分类列表数据
  const loadCategoryList = async (
    customParams?: { name?: string },
    customPage?: number
  ) => {
    setLoading(true);
    try {
      // 使用传入的参数，如果没有则使用 state 中的值
      const params = customParams !== undefined ? customParams : searchParams;
      const page = customPage !== undefined ? customPage : pagination.current;
      const res = await getCategoryList({
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
      console.error("加载分类列表失败:", error);
      message.error("加载分类列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoryList();
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
    };
    // 更新 state（用于其他地方可能需要用到）
    setSearchParams(newSearchParams);
    // 直接使用新的搜索参数和第一页加载数据，不依赖 state 更新
    loadCategoryList(newSearchParams, 1);
  };

  // 处理新增分类
  const handleAdd = () => {
    setModalTitle("新增分类");
    setEditingCategoryId(null);
    categoryForm.resetFields();
    categoryForm.setFieldsValue({ status: 1, sort: 0 }); // 默认上架，排序为0
    setModalVisible(true);
  };

  // 处理编辑分类
  const handleEdit = (record: Category) => {
    setModalTitle("编辑分类");
    setEditingCategoryId(record.id);
    categoryForm.setFieldsValue({
      name: record.name,
      sort: record.sort,
      status: record.status,
    });
    setModalVisible(true);
  };

  // 处理表单提交（新增/编辑）
  const handleCategoryFormSubmit = async () => {
    try {
      const values = await categoryForm.validateFields();

      if (editingCategoryId) {
        // 编辑分类
        const updateParams: UpdateCategoryParams = {
          name: values.name,
          sort: values.sort,
          status: values.status,
        };
        await updateCategory(editingCategoryId, updateParams);
        message.success("分类更新成功");
      } else {
        // 新增分类
        const createParams: CreateCategoryParams = {
          name: values.name,
          sort: values.sort ?? 0,
          status: values.status ?? 1,
        };
        await createCategory(createParams);
        message.success("分类创建成功");
      }

      setModalVisible(false);
      categoryForm.resetFields();
      await loadCategoryList();
    } catch (error: any) {
      if (error?.errorFields) {
        // 表单验证错误
        return;
      }
      console.error("操作失败:", error);
      message.error(error?.message || "操作失败");
    }
  };

  // 处理删除分类
  const handleDelete = (record: Category) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除分类 "${record.name}" 吗？此操作不可恢复。`,
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteCategory(record.id);
          // 重新加载列表
          await loadCategoryList();
          message.success("分类已删除");
        } catch (error) {
          console.error("删除分类失败:", error);
          message.error("删除分类失败");
        }
      },
    });
  };

  // 处理上架/下架
  const handleStatusChange = async (categoryId: number, checked: boolean) => {
    try {
      await updateCategoryStatus(categoryId, checked ? 1 : 0);
      // 更新本地数据
      setDataSource((prev) =>
        prev.map((item) =>
          item.id === categoryId ? { ...item, status: checked ? 1 : 0 } : item
        )
      );
      message.success(checked ? "分类已上架" : "分类已下架");
    } catch (error) {
      console.error("更新分类状态失败:", error);
      message.error("更新分类状态失败");
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: "分类名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "上架/下架",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",
      render: (value: number, record: Category) => (
        <Switch
          checked={value === 1}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      align: "center",
      render: (_: unknown, record: Category) => (
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
    <div className="product-category-page">
      {/* 搜索区域 */}
      <div className="product-category-search">
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="name" style={{ marginBottom: 0 }}>
            <Input
              allowClear
              placeholder="请输入分类名称"
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
      <div className="product-category-table">
        <Table<Category>
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
        />
      </div>

      {/* 自定义分页组件 */}
      <div className="product-category-pagination">
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

      {/* 新增/编辑分类弹窗 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleCategoryFormSubmit}
        onCancel={() => {
          setModalVisible(false);
          categoryForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
        width={500}
      >
        <Form
          form={categoryForm}
          layout="vertical"
          initialValues={{ status: 1, sort: 0 }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[
              { required: true, message: "请输入分类名称" },
              { max: 50, message: "分类名称不能超过50个字符" },
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: "请输入排序值" }]}
          >
            <InputNumber
              placeholder="请输入排序值"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: "请选择状态" }]}
            valuePropName="checked"
            getValueFromEvent={(checked) => (checked ? 1 : 0)}
            getValueProps={(value) => ({ checked: value === 1 })}
          >
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
