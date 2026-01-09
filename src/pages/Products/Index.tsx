import type { Category } from "@/api/category";
import { getAllCategories } from "@/api/category";
import type {
  CreateProductParams,
  Product,
  UpdateProductParams,
} from "@/api/product";
import {
  createProduct,
  deleteProduct,
  getProductList,
  updateProduct,
  updateProductStatus,
} from "@/api/product";
import Pagination from "@/components/Pagination";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PlusOutlined as PlusOutlinedIcon,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Switch,
  Table,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { smartCompressImage } from "@/util/imageCompress";
import "./products.scss";

interface ProductRecord extends Product {
  createdAt: string; // ISO 字符串
}

export default function Products() {
  const [form] = Form.useForm();
  const [productForm] = Form.useForm(); // 菜品表单（新增/编辑）
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ProductRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 分类列表（用于下拉菜单）
  const [categories, setCategories] = useState<Category[]>([]);

  // 搜索条件
  const [searchParams, setSearchParams] = useState<{
    name?: string;
    categoryId?: number;
  }>({});

  // 新增/编辑弹窗状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("新增菜品");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);

  // 加载分类列表（用于下拉菜单）
  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      console.log("分类数据:", res);
      setCategories(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("加载分类列表失败:", error);
    }
  };

  // 加载菜品列表数据
  const loadProductList = async (
    customParams?: { name?: string; categoryId?: number },
    customPage?: number
  ) => {
    setLoading(true);
    try {
      // 使用传入的参数，如果没有则使用 state 中的值
      const params = customParams !== undefined ? customParams : searchParams;
      const page = customPage !== undefined ? customPage : pagination.current;
      const res = await getProductList({
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
      console.error("加载菜品列表失败:", error);
      message.error("加载菜品列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProductList();
  }, []);

  useEffect(() => {
    loadProductList();
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
      categoryId: values.categoryId || undefined,
    };
    // 更新 state（用于其他地方可能需要用到）
    setSearchParams(newSearchParams);
    // 直接使用新的搜索参数和第一页加载数据，不依赖 state 更新
    loadProductList(newSearchParams, 1);
  };

  // 处理新增菜品
  const handleAdd = () => {
    setModalTitle("新增菜品");
    setEditingProductId(null);
    productForm.resetFields();
    productForm.setFieldsValue({ status: 1, pointCost: 0 }); // 默认上架，积分为0
    setImageFileList([]);
    setModalVisible(true);
  };

  // 处理编辑菜品
  const handleEdit = (record: ProductRecord) => {
    setModalTitle("编辑菜品");
    setEditingProductId(record.id);
    productForm.setFieldsValue({
      categoryId: record.categoryId,
      name: record.name,
      pointCost: record.pointCost,
      image: record.image,
      description: record.description,
      status: record.status,
    });
    // 如果有图片URL，设置为已上传的文件
    if (record.image) {
      setImageFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: record.image,
        },
      ]);
    } else {
      setImageFileList([]);
    }
    setModalVisible(true);
  };

  // 图片上传前的处理（压缩并转换为base64）
  const beforeUpload = async (file: File): Promise<boolean> => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("只能上传图片文件！");
      return false;
    }

    try {
      // 使用智能压缩函数，自动调整压缩参数确保文件大小在500KB以内
      const compressedBase64 = await smartCompressImage(file, 500);
      productForm.setFieldsValue({ image: compressedBase64 });
      message.success("图片压缩成功");
    } catch (error) {
      console.error("图片压缩失败:", error);
      message.error("图片处理失败，请重试");
      return false;
    }

    return false; // 阻止自动上传，手动处理
  };

  // 图片上传组件的change事件
  const handleImageChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];

    // 只保留最后一个文件
    newFileList = newFileList.slice(-1);

    // 读取文件状态
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // 如果服务器返回了URL，使用服务器返回的URL
        file.url = file.response.url;
      }
      return file;
    });

    setImageFileList(newFileList);
  };

  // 处理表单提交（新增/编辑）
  const handleProductFormSubmit = async () => {
    try {
      const values = await productForm.validateFields();

      if (editingProductId) {
        // 编辑菜品
        const updateParams: UpdateProductParams = {
          categoryId: values.categoryId,
          name: values.name,
          pointCost: values.pointCost,
          image: values.image,
          description: values.description,
          status: values.status,
        };
        await updateProduct(editingProductId, updateParams);
        message.success("菜品更新成功");
      } else {
        // 新增菜品
        const createParams: CreateProductParams = {
          categoryId: values.categoryId,
          name: values.name,
          pointCost: values.pointCost ?? 0,
          image: values.image,
          description: values.description,
          status: values.status ?? 1,
        };
        await createProduct(createParams);
        message.success("菜品创建成功");
      }

      setModalVisible(false);
      productForm.resetFields();
      setImageFileList([]);
      await loadProductList();
    } catch (error: any) {
      if (error?.errorFields) {
        // 表单验证错误
        return;
      }
      console.error("操作失败:", error);
      message.error(error?.message || "操作失败");
    }
  };

  // 处理删除菜品
  const handleDelete = (record: ProductRecord) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除菜品 "${record.name}" 吗？此操作不可恢复。`,
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteProduct(record.id);
          // 重新加载列表
          await loadProductList();
          message.success("菜品已删除");
        } catch (error) {
          console.error("删除菜品失败:", error);
          message.error("删除菜品失败");
        }
      },
    });
  };

  // 处理上架/下架
  const handleStatusChange = async (productId: number, checked: boolean) => {
    try {
      await updateProductStatus(productId, checked ? 1 : 0);
      // 更新本地数据
      setDataSource((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, status: checked ? 1 : 0 } : item
        )
      );
      message.success(checked ? "菜品已上架" : "菜品已下架");
    } catch (error) {
      console.error("更新菜品状态失败:", error);
      message.error("更新菜品状态失败");
    }
  };

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnsType<ProductRecord> = [
    {
      title: "菜品图片",
      dataIndex: "image",
      key: "image",
      width: 120,
      align: "center",
      render: (image: string) => {
        if (image) {
          return (
            <Image
              src={image}
              alt="菜品图片"
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 4 }}
              fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iMzAiIHk9IjM1IiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mHPC90ZXh0Pjwvc3ZnPg=="
            />
          );
        }
        return (
          <div
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#f0f0f0",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: 12,
            }}
          >
            无图片
          </div>
        );
      },
    },
    {
      title: "菜品名称",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "消耗积分",
      dataIndex: "pointCost",
      key: "pointCost",
      width: 120,
      align: "center",
      render: (value: number) => `${value} 积分`,
    },
    {
      title: "所属分类",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 150,
      align: "center",
      render: (categoryName: string) => categoryName || "-",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      align: "center",
      render: (dateString: string) => formatDateTime(dateString),
    },
    {
      title: "上架/下架",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",
      render: (value: number, record: ProductRecord) => (
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
      render: (_: unknown, record: ProductRecord) => (
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
    <div className="products-page">
      {/* 搜索区域 */}
      <div className="products-search">
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="name" style={{ marginBottom: 0 }}>
            <Input
              allowClear
              placeholder="请输入菜品名称"
              className="search-input"
            />
          </Form.Item>
          <Form.Item name="categoryId" style={{ marginBottom: 0 }}>
            <Select
              placeholder="请选择分类"
              allowClear
              style={{ width: 200 }}
              className="search-select"
              showSearch={false}
            >
              {categories && categories.length > 0
                ? categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))
                : null}
            </Select>
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
      <div className="products-table">
        <Table<ProductRecord>
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
        />
      </div>

      {/* 自定义分页组件 */}
      <div className="products-pagination">
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

      {/* 新增/编辑菜品弹窗 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleProductFormSubmit}
        onCancel={() => {
          setModalVisible(false);
          productForm.resetFields();
          setImageFileList([]);
        }}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={productForm}
          layout="vertical"
          initialValues={{ status: 1, pointCost: 0 }}
        >
          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: "请选择分类" }]}
          >
            <Select placeholder="请选择分类">
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  暂无分类
                </Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="菜品名称"
            rules={[
              { required: true, message: "请输入菜品名称" },
              { max: 100, message: "菜品名称不能超过100个字符" },
            ]}
          >
            <Input placeholder="请输入菜品名称" />
          </Form.Item>
          <Form.Item
            name="pointCost"
            label="消耗积分"
            rules={[
              { required: true, message: "请输入消耗积分" },
              { type: "number", min: 0, message: "积分必须大于等于0" },
            ]}
          >
            <InputNumber
              placeholder="请输入消耗积分"
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ max: 255, message: "描述不能超过255个字符" }]}
          >
            <Input.TextArea
              placeholder="请输入描述"
              rows={3}
              maxLength={255}
              showCount
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="image"
                label="菜品图片"
                rules={[{ required: false }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={imageFileList}
                  onChange={handleImageChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  onRemove={() => {
                    setImageFileList([]);
                    productForm.setFieldsValue({ image: undefined });
                    return true;
                  }}
                >
                  {imageFileList.length >= 1 ? null : (
                    <div>
                      <PlusOutlinedIcon />
                      <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
